import "dotenv/config"
import { Connection, createConnection, getMongoRepository } from "typeorm"

import { databaseConfig } from "../config/database"
import { Collection } from "../Entities"
import { metaphysics } from "../lib/metaphysics"
import { search } from "../lib/search"

/**
 * This indexes an ElasticSearch cluster with collections data.
 */

export const indexForSearch = async () => {
  let connection: Connection | undefined

  try {
    const connectionArgs = databaseConfig()
    connection = await createConnection(connectionArgs)

    if (connection.isConnected) {
      const repository = getMongoRepository(Collection)

      const collections = await repository.find()
      for (const collection of collections) {
        // Schema assumes fields named `name`, `featured_names`, `alternate_names`
        // to be present for text search through those fields.
        // Additionally, `visible_to_public` and `search_boost` are required for
        // proper surfacing of results.
        const name = collection.title
        const alternate_names = collection.query.keyword
        const featured_names = collection.category
        const description = collection.description
        const slug = collection.slug
        const visible_to_public = true
        const search_boost = 1000

        let image_url: string = ""

        try {
          const resp: any = await metaphysics({
            query: `query FetchArtworks($slug: String!) {
            marketingCollection(slug: $slug) {
              artworks(size: 1) {
                hits {
                  imageUrl
                }
              }
            }
          }`,
            variables: { slug: collection.slug },
          })

          image_url = resp.data.marketingCollection.artworks.hits[0].imageUrl
        } catch (error) {
          console.log(
            `${collection.slug} - error fetching artworks: `,
            error.message
          )
        }

        await search.client.index({
          index: search.index,
          type: "marketing_collection",
          id: collection.id.toString(),
          body: {
            name,
            alternate_names,
            featured_names,
            description,
            slug,
            visible_to_public,
            search_boost,
            image_url,
          },
        })

        console.log("Successfully updated: ", collection.title)
      }
    } else {
      throw new Error("could not connect to database")
    }
  } finally {
    /* tslint:disable:no-unused-expression */
    connection && connection.close()
    /* tslint:enable:no-unused-expression */
  }
}
