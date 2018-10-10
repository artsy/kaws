import "reflect-metadata"

import { GraphQLServer, Options } from "graphql-yoga"
import { Connection, createConnection } from "typeorm"
import { createSchema } from "./createSchema"
import { entities } from "./Entities"

const { MONGOHQ_URL, PORT } = process.env

async function bootstrap() {
  const schema = await createSchema()
  const server = new GraphQLServer({ schema })

  const connection: Connection = await createConnection({
    type: "mongodb",
    url: MONGOHQ_URL,
    entities,
  })

  const serverOptions: Options = {
    port: PORT,
    endpoint: "/graphql",
    playground: "/playground",
  }

  server.start(serverOptions, ({ port, playground }) => {
    // tslint:disable-next-line
    console.log(`Server is running, GraphQL Playground available at http://localhost:${port}${playground}`)
  })
}

bootstrap()
