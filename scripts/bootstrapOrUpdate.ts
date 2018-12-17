import "dotenv/config"
import { MongoClient } from "mongodb"

import { databaseURL } from "../src/config/database"
import { Collection } from "../src/Entities"

import { loadCsvAsCollection } from "./loadCsvAsColleciton"

/**
 * This script allows us to bootstrap or update a database on the configured MongoDB database
 * with collections data. It will then update the collection MongoDB objects with the data in a specified JSON file
 *
 * @usage yarn update-database ./fixtures/collections.json
 */
async function bootstrapOrUpdate(data: Collection[]) {
  const connection = await MongoClient.connect(databaseURL!)
  const database = connection.db()
  const collection = database.collection("Collections")

  try {
    if (connection.isConnected) {
      for (const entry of data) {
        await collection.update({ slug: entry.slug }, entry, { upsert: true })
        console.log("Successfully updated: ", entry.title)
      }

      console.log("Successfully updated collections database")
      connection.close()
    }
    process.exit(0)
  } catch (error) {
    console.error("[kaws] Error bootstrapping data:", error)
    process.exit(1)
  }
}

const csvFile = process.argv[2]

loadCsvAsCollection(csvFile).then(collection => bootstrapOrUpdate(collection))
