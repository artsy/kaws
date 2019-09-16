import { GraphQLError, GraphQLFormattedError } from "graphql"
import { EntityNotFoundError } from "typeorm/error/EntityNotFoundError"

type WriteablePartial<T> = { -readonly [P in keyof T]+?: T[P] }

export const formatError = (err: GraphQLError) => {
  const result: WriteablePartial<GraphQLFormattedError> = {
    message: err.message,
  }

  if (err.locations) {
    result.locations = err.locations
  }

  if (err.path) {
    result.path = err.path
  }

  const originalError = err.originalError
  if (originalError instanceof EntityNotFoundError) {
    result.extensions = { code: 404 }
  }

  return result
}
