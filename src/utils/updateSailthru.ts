import "dotenv/config"
import * as SailthruAPI from "sailthru-client"
import { Connection, createConnection, getMongoRepository } from "typeorm"
import { databaseConfig } from "../config/database"
import { Collection } from "../Entities"
import { getArtists } from "./getArtists"
import { getArtworks } from "./getArtworks"

const { SAILTHRU_KEY, SAILTHRU_SECRET } = process.env

const sailthru = SailthruAPI.createSailthruClient(SAILTHRU_KEY, SAILTHRU_SECRET)

export const pushContentToSailthru = async () => {
  let connection: Connection | undefined

  try {
    const connectionArgs = databaseConfig()
    connection = await createConnection(connectionArgs)

    if (connection.isConnected) {
      const repository = getMongoRepository(Collection)
      const collections = await repository.find()
      for (const collection of collections) {
        const name = collection.title
        const featured_names = collection.category
        const collection_slug = collection.slug
        const image = collection.headerImage
        const body_text = collection.description
        const full_url = `https://www.artsy.net/collection/${collection_slug}`
        const all_artworks = await getArtworks(
          `{marketingCollection(slug: "${collection.slug}") {
            artworks { 
               hits {
                  id
                }
              }
            }
          }`
        )
        const all_artists = await getArtists(`
        {
          marketingCollection(slug: "${collection.slug}") {
            artworks {
              hits {
                artist {
                  id
                }
              }
            }
          }
        }
        `)

        const options = {
          tags: ["collection"].concat(all_artists),
          vars: {
            slug: collection_slug,
            collection_category: featured_names,
            description: body_text,
            artworks_slugs: all_artworks,
          },
          images: {
            full: {
              url: image,
            },
          },
        }
        sailthru.pushContent(name, full_url, options, (err, response) => {
          if (err) {
            console.log(`Error: ${err}`)
            return
          }
          console.log(`Success: collection ${name} posted`)
        })
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
