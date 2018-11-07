import { buildSchema } from "type-graphql"
import { CollectionsResolver } from "../Resolvers/Collections"

export async function createSchema() {
  const schema = await buildSchema({
    resolvers: [CollectionsResolver],
  })
  return schema
}
