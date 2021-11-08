import "dotenv/config"
import { Connection, createConnection, getMongoRepository } from "typeorm"

import { databaseConfig } from "../config/database"
import { Collection } from "../Entities"
import { metaphysics } from "../lib/metaphysics"
import { search, algoliaSearch, algoliaSetSettings } from "../lib/search"

/**
 * This indexes ElasticSearch and Algolia with collections data.
 */

interface DebugRecord {
  slug: string
  reason: string
  data: string
}

export const indexForSearch = async () => {
  let connection: Connection | undefined
  const bogus_collections: DebugRecord[] = []
  try {
    const connectionArgs = databaseConfig()
    connection = await createConnection(connectionArgs)

    if (connection.isConnected) {
      const repository = getMongoRepository(Collection)
      const collections = await repository.find()
      algoliaSetSettings()

      for (const collection of collections) {
        console.log(`Now processing ${collection.slug}`)

        if (!collection.query) {
          console.log(
            `\t[error] ${collection.slug} - no query found, skipping!`
          )
          bogus_collections.push({
            slug: collection.slug,
            reason: "no query found",
            data: "",
          })
          continue
        }
        // Schema assumes fields named `name`, `featured_names`, `alternate_names`
        // to be present for text search through those fields.
        // Additionally, `visible_to_public` and `search_boost` are required for
        // proper surfacing of results.
        const name = collection.title
        const keyword = collection.query.keyword
        const category = collection.category
        const description = collection.description
        const slug = collection.slug
        const visible_to_public = true
        const search_boost = 1000

        let image_url: string = ""

        try {
          const resp: any = await metaphysics({
            query: `query FetchArtworks($slug: String!) {
            marketingCollection(slug: $slug) {
              artworks(size: 1, sort: "-decayed_merch") {
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
            `\t[error] - ${collection.slug} - error fetching artworks: `,
            error.message
          )
          bogus_collections.push({
            slug: collection.slug,
            reason: "error fetching artworks",
            data: error.message,
          })
          continue
        }

        try {
          await search.client.index({
            index: search.index,
            type: "marketing_collection",
            id: collection.id.toString(),
            body: {
              name,
              alternate_names: keyword,
              featured_names: category,
              description,
              slug,
              visible_to_public,
              search_boost,
              image_url,
            },
          })

          await algoliaSearch.index.saveObject({
            objectID: collection.id.toString(),
            name,
            slug,
            keyword,
            category,
            search_boost,
            href: `/collection/${slug}`,
            image_url,
          })
        } catch (e) {
          console.log(
            `\t[error] - ${collection.slug} - error writing collection to database: `,
            e.message
          )
          bogus_collections.push({
            slug: collection.slug,
            reason: "error writing to database",
            data: e.message,
          })
          continue
        }

        console.log(`\t${collection.slug} - successfully updated!`)
      }
    } else {
      throw new Error("could not connect to database")
    }
  } finally {
    /* tslint:disable:no-unused-expression */
    connection && connection.close()
    /* tslint:enable:no-unused-expression */
    if (bogus_collections.length > 0) {
      console.log("The following collections were unable to be indexed:")
      bogus_collections.map(({ slug, reason }) =>
        console.log(`${slug} - ${reason}`)
      )
    }
  }
}
