import { printSchema } from "graphql"
import { createSchema } from "../createSchema"

it("creates an SDL", async () => {
  const kawsSchema = await createSchema()

  expect(
    printSchema(kawsSchema, { commentDescriptions: true })
  ).toMatchSnapshot()
})
