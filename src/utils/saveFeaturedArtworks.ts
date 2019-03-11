import "dotenv/config"
import { compact } from "lodash"
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
    const queryAsString = mapQueryToString(collection.query)

    const featuredArtworks = await getFeaturedArtworks(
      `{
        filter_artworks(sort: "merchandisability", size: 3 ${
          queryAsString ? `, ${queryAsString}` : ""
        }) {
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
  try {
    return results.filter_artworks.hits
  } catch (error) {
    throw error
  }
}

/**
 * Convert snake_case field names to camelCase
 */
export const sanitizeArtworkArray = (artworks: any[]) => {
  const newArtworks = artworks.map(artwork => {
    const { image } = artwork
    if (image.aspect_ratio) {
      image.aspectRatio = image.aspect_ratio
      delete image.aspect_ratio
    }
    if (image.image_url) {
      image.imageUrl = image.image_url
      delete image.image_url
    }
    return artwork
  })
  return newArtworks
}

/**
 * Convert collection.query to digestible string for graphql
 */
export const mapQueryToString = query => {
  const queryStrings = Object.keys(query).map(key => {
    const value = query[key]
    if (value && value.length) {
      if (Array.isArray(value)) {
        const keysAsString = value.map(val => `"${val}"`)
        return `${key}: [${keysAsString}]`
      } else {
        return `${key}: "${query[key]}"`
      }
    }
  })
  const cleanQuery = compact(queryStrings)
  if (cleanQuery && cleanQuery.length) {
    return compact(queryStrings).join(", ")
  }
}
