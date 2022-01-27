import "dotenv/config"
import { Connection, createConnection, getMongoRepository } from "typeorm"
import { MongoClient } from "mongodb"
import { databaseURL } from "../config/database"
import { databaseConfig } from "../config/database"
import { Collection } from "../Entities"
import { getPriceGuidance } from "./getPriceGuidance"

/**
 * This updates the price guidance field for all valid collections.
 */

interface ErrorRecord {
  slug: string
  reason: string
  data: string
}

export const updatePriceGuidance = async () => {
  let connection: Connection | undefined
  const erroredCollections: ErrorRecord[] = []
  try {
    const connectionArgs = databaseConfig()
    connection = await createConnection(connectionArgs)
    const mongoConnection = await MongoClient.connect(databaseURL!)
    const database = mongoConnection.db()
    const mongoCollection = database.collection("collection")

    if (connection.isConnected) {
      const repository = getMongoRepository(Collection)
      const collections = await repository.find()
      for (const collection of collections) {
        console.log(`[PriceGuidance] Updating ${collection.slug}...`)

        if (!collection.query) {
          erroredCollections.push({
            slug: collection.slug,
            reason: "no query found",
            data: "",
          })
          continue
        }

        const slug = collection.slug
        const id = collection.id
        try {
          const priceGuidance = await getPriceGuidance(slug)
          if (priceGuidance) {
            await mongoCollection.updateOne(
              { id },
              { $set: { price_guidance: priceGuidance } }
            )
          }
        } catch (error) {
          erroredCollections.push({
            slug: collection.slug,
            reason: "error fetching artworks",
            data: error.message,
          })
          continue
        }
      }
    } else {
      throw new Error("could not connect to database")
    }
  } finally {
    /* tslint:disable:no-unused-expression */
    connection && connection.close()
    /* tslint:enable:no-unused-expression */
    if (erroredCollections.length > 0) {
      console.log(
        "[PriceGuidance] The following collections encountered an error:"
      )
      erroredCollections.map(({ slug, reason }) =>
        console.log(`${slug} - ${reason}`)
      )
    }
  }
}
