import "reflect-metadata"

import { GraphQLServer, Options } from "graphql-yoga"
import * as morgan from "morgan"
import { Connection, createConnection } from "typeorm"
import { createSchema } from "./createSchema"
import { entities } from "./Entities"

const { MONGOHQ_URL, NODE_ENV, PORT } = process.env

async function bootstrap() {
  const schema = await createSchema()
  const server = new GraphQLServer({ schema })
  const app = server.express

  const connection: Connection = await createConnection({
    type: "mongodb",
    url: MONGOHQ_URL,
    entities,
  })

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
}

bootstrap()
