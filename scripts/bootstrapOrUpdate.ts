import "dotenv/config"

import * as csv from "csv-parser"
import * as fs from "fs"

import { databaseURL } from "../src/config/database"

import { MongoClient } from "mongodb"
import { Collection } from "../src/Entities"

const csvFile = process.argv[2]
const results: any[] = []
let formattedCollections: Collection[]

if (!csvFile) {
  console.error("Please pass a collections csv file")
}

fs.createReadStream(csvFile)
  .pipe(csv())
  .on("data", data => results.push(data))
  .on("end", () => {
    if (results.length > 0) {
      formattedCollections = results.map(result => {
        return {
          title: result.title,
          slug: result.slug,
          category: result.category,
          description: result.description,
          headerImage: result.headerImage,
          credit: result.credit,
          query: {
            artist_ids: result.artist_ids,
            gene_ids: result.gene_ids,
            tag_id: result.tag_id,
            keyword: result.keyword,
          },
        } as Collection
      })
    }
  })

bootstrapOrUpdate()

/**
 * This script allows us to bootstrap or update a database on the configured MongoDB database
 * with collections data. It will then update the collection MongoDB objects with the data in a specified JSON file
 *
 * @usage yarn update-database ./fixtures/collections.json
 */
async function bootstrapOrUpdate() {
  const connection = await MongoClient.connect(databaseURL!)
  const database = connection.db()
  const collection = database.collection("Collections")

  try {
    if (connection.isConnected && formattedCollections) {
      for (const entry of formattedCollections) {
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
