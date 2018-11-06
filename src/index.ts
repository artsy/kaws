import "dotenv/config"

import * as ddTracer from "dd-trace"

const {
  DD_APM_ENABLED,
  DD_TRACE_AGENT_HOSTNAME,
  MONGOHQ_URL,
  NODE_ENV,
  PORT,
} = process.env

// Setup DataDog before importing another modules,
// so DataDog gets a chance to patch the integrations as per the documation.
// https://github.com/DataDog/dd-trace-js/blob/f638dd66845806ed3ee06e8fbf32b0062b9d21d7/src/proxy.js#L33
if (DD_APM_ENABLED) {
  ddTracer.init({
    hostname: DD_TRACE_AGENT_HOSTNAME,
    service: "kaws",
    plugins: false,
    // TODO: figure out how to get the debugger working
    // debug: true,
    // logger: {
    //   debug: console.log,
    //   error: console.error,
    // },
  })
  ddTracer.use("express", {
    service: "kaws",
    headers: ["User-Agent"],
  })
  ddTracer.use("graphql", {
    service: "kaws.graphql",
  })
  ddTracer.use("http", {
    service: `kaws.http-client`,
  })
}

// tslint:disable:no-console
import "reflect-metadata"

import { GraphQLServer, Options } from "graphql-yoga"
import { parse } from "mongodb-uri"
import * as morgan from "morgan"
import { Connection, createConnection } from "typeorm"

import { createSchema } from "./createSchema"
import { entities } from "./Entities"

export const mongoConnectArgs = () => {
  // Get correct connection args based on NODE_ENV
  const { username, password, database, hosts, options } = parse(MONGOHQ_URL!)
  const hostName = hosts.map(a => a.host).join(",")

  if (hostName === "localhost") {
    return {
      url: MONGOHQ_URL,
      type: "mongodb",
      entities,
    }
  } else {
    return {
      type: "mongodb",
      username,
      password,
      database,
      ...options,
      host: hostName,
      port: 27017,
      ssl: true,
      entities,
    }
  }
}

bootstrap()

async function bootstrap() {
  // Setup Database
  try {
    const { database } = parse(MONGOHQ_URL!)
    const connectionArgs = mongoConnectArgs()
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
    const app = server.express
    const serverOptions: Options = {
      port: PORT,
      endpoint: "/graphql",
      playground: "/playground",
      debug: NODE_ENV === "development",
    }

    // Setup middleware
    app.use(morgan("combined"))

    // Setup endpoints
    app.get("/health", (req, res) => res.status(200).end())

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
