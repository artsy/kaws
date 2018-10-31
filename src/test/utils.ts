import { graphql } from "graphql"

export const runQuery = async (query, rootValue, createMockSchema) => {
  const schema = await createMockSchema()
  return graphql(schema, query, rootValue, {}).then(result => {
    if (result.errors) {
      const error = result.errors[0]
      throw error.originalError || error
    } else {
      return result.data
    }
  })
}
