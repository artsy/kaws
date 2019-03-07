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
          const collectionWithImages = await attachFeaturedArtworks(collection)
          await repository.update(
            { slug: collectionWithImages.slug },
            collectionWithImages
          )
          console.log("Successfully updated: ", collection.slug)
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

export const attachFeaturedArtworks = async collection => {
  try {
    const [all_artworks] = await getFeaturedArtworks(
      `{
        marketingCollection(slug: "${collection.slug}") {
          artworks(sort: "merchandisability", size: 3) {
            hits {
              id
              _id
              image {
                aspect_ratio
                height
                width
                url(version: "medium")
                position
                image_url
                versions
              }
            }
          }
        }
      }`
    )
    // attach fetched artworks to collection
    collection.featuredArtworks = all_artworks
    return collection
  } catch (e) {
    console.log("Error", e)
  }
}

export const getFeaturedArtworks = async (query: string) => {
  const results: any = await metaphysics(`${query}`)
  let artworkArray
  try {
    artworkArray = results.marketingCollection.artworks.hits
  } catch (error) {
    throw error
  }
  return [artworkArray]
}
