import "dotenv/config"

import { convertCSVToJSON } from "../src/utils/convertCSVToJSON"
import { updateDatabase } from "../src/utils/updateDatabase"

const csvFile = process.argv[2]

/**
 * This script allows us to bootstrap or update a database on the configured MongoDB database
 * with collections data. It will then update the collection MongoDB objects with the data in a specified JSON file
 *
 * @usage yarn update-database ./fixtures/collections.csv
 */
export async function bootstrapOrUpdate(path: string) {
  try {
    const data = await convertCSVToJSON(path)
    await updateDatabase(data)
    process.exit(0)
  } catch (e) {
    console.log(e.message)
    process.exit(1)
  }
}

bootstrapOrUpdate(csvFile)
