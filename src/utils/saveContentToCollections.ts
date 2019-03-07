import "dotenv/config"
import { Connection, createConnection, getMongoRepository } from "typeorm"
import { databaseConfig } from "../config/database"
import { Collection } from "../Entities"
import metaphysics from "../lib/metaphysics"

export const saveContentToCollections = async () => {
  let connection: Connection | undefined

  try {
    const connectionArgs = databaseConfig()
    connection = await createConnection(connectionArgs)

    if (connection.isConnected) {
      const repository = getMongoRepository(Collection)
      const collections = await repository.find()
      for (const collection of collections) {
        try {
          await saveContentToCollection(collection)
        } catch (e) {
          console.log(`Error saving ${collection.slug}`, e)
        }
      }
    } else {
      throw new Error("Could not connect to database")
    }
  } finally {
    /* tslint:disable:no-unused-expression */
    connection && connection.close()
    /* tslint:disable:no-unused-expression */
  }
}

export const saveContentToCollection = async collection => {
  try {
    console.log("collection", collection.title)
    const [all_artworks] = await getFeaturedArtworkImages(
      `{
        marketingCollection(slug: "${collection.slug}") {
          artworks(sort: "merchandisability", size: 3) {
            hits {
              id
              image {
                aspect_ratio
                height
                width
                url(version: "small")
              }
            }
          }
        }
      }`
    )
    console.log("fetchedData", all_artworks)
    // save data to collection
    console.log("Going to save")
  } catch (e) {
    console.log("Error", e)
  }
}

export const getFeaturedArtworkImages = async (query: string) => {
  const results: any = await metaphysics(`${query}`)
  let artworkArray
  try {
    artworkArray = results.marketingCollection.artworks.hits.map(x => x)
  } catch (error) {
    throw error
  }
  return [artworkArray]
}
