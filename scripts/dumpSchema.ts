import "dotenv/config"

import { writeFileSync } from "fs"
import { printSchema } from "graphql/utilities"
import { format } from "prettier"
import { createSchema } from "../src/createSchema"

// Support both passing a folder or a filename
const schemaPath = "_schema.graphql"

createSchema().then(schema => {
  // commentDescriptions means it uses # instead of the ugly """
  const schemaText = printSchema(schema, { commentDescriptions: true })
  const prettySchema = format(schemaText, { parser: "graphql" })

  // Save user readable type system shorthand of schema
  writeFileSync(schemaPath, prettySchema, "utf8")
})
