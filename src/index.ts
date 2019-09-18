import "dotenv/config"
import { setupDataDog } from "./config/datadog"
import { ensureSSL } from "./lib/ensureSSL"
const { MONGOHQ_URL, NODE_ENV, PORT, SENTRY_PRIVATE_DSN } = process.env

// Setup DataDog before importing another modules,
// so DataDog gets a chance to patch the integrations as per the documation.
// https://github.com/DataDog/dd-trace-js/blob/f638dd66845806ed3ee06e8fbf32b0062b9d21d7/src/proxy.js#L33
setupDataDog()

// tslint:disable:no-console
import "reflect-metadata"

import * as Sentry from "@sentry/node"
import * as express from "express"
import { GraphQLServer, Options } from "graphql-yoga"
import { parse } from "mongodb-uri"
import * as morgan from "morgan"
import { Connection, createConnection } from "typeorm"
import { databaseConfig } from "./config/database"
import GSheetImportApp from "./Routes/GSheetImport"
import { createSchema } from "./utils/createSchema"
import { formatError } from "./utils/errorHandling"

const enableSentry = Boolean(SENTRY_PRIVATE_DSN)

bootstrap()

export let app: express.Application

async function bootstrap() {
  // Setup Database
  try {
    const { database } = parse(MONGOHQ_URL!)
    const connectionArgs = databaseConfig()
    const connection: Connection = await createConnection(connectionArgs)

    if (connection.isConnected) {
      console.log(
        "[kaws] Successfully connected to MongoDB database:",
        database
      )
    }
  } catch (error) {
    console.error("[kaws] Error to connecting to MongoDB:", error)
  }

  // Setup server
  try {
    const schema = await createSchema()
    const server = new GraphQLServer({ schema })
    app = server.express
    const serverOptions: Options = {
      port: PORT,
      endpoint: "/graphql",
      playground: "/playground",
      debug: NODE_ENV === "development",
      formatError,
    }

    // Setup Sentry
    if (enableSentry) {
      Sentry.init({
        dsn: SENTRY_PRIVATE_DSN,
      })

      // The request handler must be the first middleware on the app
      app.use(Sentry.Handlers.requestHandler())

      // The error handler must be before any other error middleware
      app.use(Sentry.Handlers.errorHandler())
    }

    // Setup middleware
    app.use(morgan("combined"))

    // Make sure we're using SSL
    if (NODE_ENV !== "development") {
      app.use(ensureSSL)
      app.set("trust proxy", true)
    }

    // Setup endpoints
    app.get("/health", (req, res) => res.status(200).end())

    // Google sheet script endpoint
    app.use(GSheetImportApp)

    // Start the server
    server.start(serverOptions, ({ port, playground }) => {
      console.log(
        `[kaws] Server is running, GraphQL Playground available at http://localhost:${port}${playground}`
      )
    })
  } catch (error) {
    console.log("[kaws] Error booting server:", error)
  }
}
