import { MongoClient } from "mongodb"
import { databaseURL } from "../config/database"
import { Collection } from "../Entities"

/**
 * Updates the KAWS db with collection objects passed through
 * @param collections Collection[]
 */
export async function updateDatabase(collections: Collection[]) {
  const connection = await MongoClient.connect(databaseURL!)
  const database = connection.db()
  const collection = database.collection("collection")

  try {
    if (connection.isConnected) {
      for (const entry of collections) {
        await collection.update({ slug: entry.slug }, entry, { upsert: true })
        console.log("Successfully updated: ", entry.slug, entry.title)
      }

      console.log("Successfully updated collections database")
      connection.close()
    }
  } catch (error) {
    console.error("[kaws] Error bootstrapping data:", error)
    throw error
  } finally {
    /* tslint:disable:no-unused-expression */
    connection && connection.close()
    /* tslint:enable:no-unused-expression */
  }
}
