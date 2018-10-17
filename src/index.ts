import "reflect-metadata"

import { GraphQLServer, Options } from "graphql-yoga"
import { parse } from "mongodb-uri"
import * as morgan from "morgan"
import { Connection, createConnection } from "typeorm"
import { createSchema } from "./createSchema"
import { entities } from "./Entities"
import { setupDataDog } from "./lib/setup"

const { MONGOHQ_URL, NODE_ENV, PORT } = process.env

// tslint:disable:no-console

async function bootstrap() {
  const schema = await createSchema()
  const server = new GraphQLServer({ schema })
  const app = server.express
  setupDataDog()

  try {
    const { username, password, database, hosts, options } = parse(MONGOHQ_URL!)

    const connection: Connection = await createConnection({
      type: "mongodb",
      username,
      password,
      database,
      ...options,
      host: hosts.map(a => a.host).join(","),
      port: 27017,
      ssl: true,
      entities,
    })
    if (connection.isConnected) {
      console.log("Successfully connected to MongoDB database:", database)
    }

    const serverOptions: Options = {
      port: PORT,
      endpoint: "/graphql",
      playground: "/playground",
      debug: NODE_ENV === "development",
    }

    app.get("/health", (req, res) => {
      return res.status(200).end()
    })
    app.use(morgan("combined"))

    server.start(serverOptions, ({ port, playground }) => {
      // tslint:disable-next-line
      console.log(`Server is running, GraphQL Playground available at http://localhost:${port}${playground}`)
    })
  } catch (e) {
    console.error("Failed to connect to MongoDB ", e)
  }
}

bootstrap()
