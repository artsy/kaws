import { extend } from "lodash"
import { MongoClient } from "mongodb"
import { databaseURL } from "../config/database"
import { Collection } from "../Entities"
import { getPriceGuidance } from "../utils/getPriceGuidance"

/**
 * Updates the KAWS db with collection objects passed through
 * @param inputData Collection[]
 */
export async function updateDatabase(inputData: Collection[]) {
  const connection = await MongoClient.connect(databaseURL!)
  const database = connection.db()
  const collection = database.collection("collection")

  try {
    await upsertData(collection, inputData)
    await updatePriceGuidance(collection)
    connection.close()
  } catch (error) {
    console.error("[kaws] Error bootstrapping data:", error)
    throw error
  } finally {
    /* tslint:disable:no-unused-expression */
    connection && connection.close()
    /* tslint:enable:no-unused-expression */
  }
}

const upsertData = async (collection, inputData) => {
  try {
    for (const entry of inputData) {
      // if an entry's `price_guidance` is left null in the dataset, null
      // it out in the database - after this is finished we will compute price
      // guidance for all inputData that have a null value for it.
      if (!entry.price_guidance) {
        extend(entry, { price_guidance: null })
      }
      await collection.updateOne({ slug: entry.slug }, entry, { upsert: true })
    }
  } catch (e) {
    console.log("Error upserting data!")
    console.log(e.message)
    throw e
  }
}

const updatePriceGuidance = async (collection) => {
  const query = { price_guidance: null }
  const projection = { slug: 1, _id: 0 }
  const data = await collection.find(query, projection).toArray()
  const slugs = data.map(({ slug }) => slug)

  const error_slugs: string[] = []
  for (const slug of slugs) {
    try {
      const price_guidance = await getPriceGuidance(slug)
      if (price_guidance) {
        await collection.update({ slug }, { $set: { price_guidance } })
      }
    } catch (e) {
      console.log(
        `Unable to set price guidance for ${slug} due to error: [${e.message}]. Skipping!`
      )
      error_slugs.push(slug)
      continue
    }
  }

  return error_slugs
}
