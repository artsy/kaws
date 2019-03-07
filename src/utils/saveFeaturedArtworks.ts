import "dotenv/config"
import { Connection, createConnection, getMongoRepository } from "typeorm"
import { databaseConfig } from "../config/database"
import { Collection } from "../Entities"
import metaphysics from "../lib/metaphysics"

/**
 * Cycle through all collections in DB to fetch and save featuredArtworks
 */
export const saveFeaturedArtworks = async () => {
  let connection: Connection | undefined

  try {
    const connectionArgs = databaseConfig()
    connection = await createConnection(connectionArgs)

    if (connection.isConnected) {
      const repository = getMongoRepository(Collection)
      const collections = await repository.find()

      for (const collection of collections) {
        const { slug } = collection
        try {
          const collectionWithImages = await attachFeaturedArtworks(collection)
          await repository.update({ slug }, collectionWithImages)
          console.log("Successfully updated: ", slug)
        } catch (e) {
          console.log(`Error saving ${slug}`, e)
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

/**
 * For a given collection, attach top 3 artworks ranked by merchandisability
 */
export const attachFeaturedArtworks = async collection => {
  try {
    const featuredArtworks = await getFeaturedArtworks(
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

    collection.featuredArtworks = sanitizeArtworkArray(featuredArtworks)
    return collection
  } catch (e) {
    console.log("Error", e)
  }
}

/**
 * Pass in a query to recieve an array of artworks from metaphysics
 */
export const getFeaturedArtworks = async (query: string) => {
  const results: any = await metaphysics(`${query}`)
  let artworkArray
  try {
    artworkArray = results.marketingCollection.artworks.hits
  } catch (error) {
    throw error
  }
  return artworkArray
}

export const sanitizeArtworkArray = (artworks: any[]) => {
  return artworks.map(artwork => {
    const { image } = artwork
    image.aspectRatio = image.aspect_ratio
    delete image.aspect_ratio

    image.imageUrl = image.image_url
    delete image.image_url

    return artwork
  })
}
