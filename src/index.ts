import "reflect-metadata"

import { GraphQLServer, Options } from "graphql-yoga"
import { buildSchema } from "type-graphql"
import { CollectionsResolver } from "./CollectionsResolver"

async function bootstrap() {
  const schema = await buildSchema({
    resolvers: [CollectionsResolver],
  })

  const server = new GraphQLServer({ schema })

  const serverOptions: Options = {
    port: 4000,
    endpoint: "/graphql",
    playground: "/playground",
  }

  server.start(serverOptions, ({ port, playground }) => {
    // tslint:disable-next-line
    console.log(`Server is running, GraphQL Playground available at http://localhost:${port}${playground}`)
  })
}

bootstrap()
