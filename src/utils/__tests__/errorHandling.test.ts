import { GraphQLError } from "graphql"
import { EntityNotFoundError } from "typeorm/error/EntityNotFoundError"
import { formatError } from "../errorHandling"

const originalError = new EntityNotFoundError("Collection", "test")
const error = new GraphQLError(
  "Collection Not Found",
  undefined,
  undefined,
  undefined,
  undefined,
  originalError
)

describe(formatError, () => {
  it("returns a 404 for EntityNotFound original errors", () => {
    const errorWithExtension = formatError(error)
    expect(errorWithExtension.extensions).toEqual({ code: 404 })
  })
})
