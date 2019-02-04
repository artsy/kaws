import "dotenv/config"
// import { Connection, createConnection, getMongoRepository } from "typeorm"

// import { TableCheck } from "typeorm/schema-builder/table/TableCheck"
// import { databaseConfig } from "../config/database"
import { Collection } from "../Entities"
import { search } from "../lib/search"

// const { NODE_ENV } = process.env

/**
 * Gets artworks associated with a collection
 */

export const getArtworks = async (collection: Collection) => {
  const { query } = collection
  const { artist_ids, gene_ids, keyword, tag_id } = query

  const subQuery: any[] = []

  if (keyword) {
    subQuery.push({
      multi_match: {
        type: "most_fields",
        fields: "name.* genes.*^4 tags.*^4 auto_tags.*^2 partner_name.*^2 artist_name.*^2".split(
          " "
        ),
        query: keyword,
      },
    })

    subQuery.push({
      bool: {
        should: {
          match_phrase: {
            name: keyword,
          },
        },
      },
    })
  }

  if (artist_ids && artist_ids.length) {
    subQuery.push({
      terms: {
        artist_id: artist_ids,
      },
    })
  }

  if (gene_ids && gene_ids.length) {
    subQuery.push({
      term: {
        gene_ids,
      },
    })
  }

  if (tag_id) {
    subQuery.push({
      term: {
        tags: tag_id,
      },
    })
  }

  const response = await search.client.search({
    index: `artworks_staging`,
    body: {
      query: {
        bool: {
          must: subQuery,
        },
      },
    },
  })

  console.log(response.hits)
}

getArtworks({
  query: {
    artist_ids: ["4e934002e340fa0001005336"],
    gene_ids: [],
    tag_id: null,
    keyword:
      "Companion, BFF, Passing Through, Astroboy, Astro Boy, Small Lie, Together, Accomplice, Twins, Stormtrooper, Boba Fett, Darth Vader, Undercover Bear, Tweety, Pinocchio, Resting Place, Along the Way, Final Days, Zooth, Tweety, Joe Kaws, Snoopy, Seeing Watching, Pinocchio, Jiminy Cricket, Partners, Milo, Kubrick, Zooth, Bounty Hunter, Bearbrick, Chum, JPP, Final Days, Chompers, Cat Teeth Bank, Bend, Blitz, Bendy, Accomplice",
  },
} as any)
