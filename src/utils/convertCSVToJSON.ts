import * as csv from "csv-parser"
import * as fs from "fs"
import { Collection } from "../Entities/Collection"
import { sanitizeRow } from "./sanitizeRow"

const validate = async (input) => {
  const by_slug = input.reduce((acc, val) => ({ ...acc, [val.slug]: true }), {})
  const bad_slugs = new Set();

  const process_link = slug_string => slug_string
    .split(",")
    .forEach(slug => {
      if (slug && !by_slug[slug]) {
        bad_slugs.add(slug)
      }
    })

  input.forEach(({ artist_series, featured_collections, other_collections }) => {
    artist_series && process_link(artist_series)
    featured_collections && process_link(featured_collections)
    other_collections && process_link(other_collections)
  })

  return bad_slugs
}

export const convertCSVToJSON: (string) => Promise<Collection[]> = (
  path: string
) => {
  if (!path) {
    throw new Error("Must pass a collections csv file as an argument")
  }

  return new Promise((resolve, reject) => {
    const results: any[] = []

    fs.createReadStream(path)
      .pipe(csv())
      .on("data", data => results.push(data))
      .on("end", async () => {
        if (results.length > 0) {
          const unresolvable_slugs = await validate(results)
          if (unresolvable_slugs.size > 0) {
            reject({ error: "Unable to resolve one or more linked slugs", unresolvable_slugs: Array.from(unresolvable_slugs) })
          }
          const formattedCollections = results.map(
            ({
              title,
              slug,
              category,
              description,
              headerImage,
              thumbnail,
              credit,
              artist_ids,
              gene_ids,
              tag_id,
              keyword,
              price_guidance,
              show_on_editorial = false,
              is_featured_artist_content = false,
              artist_series_label,
              artist_series,
              featured_collections_label,
              featured_collections,
              other_collections_label,
              other_collections,
            }) =>
              sanitizeRow({
                title,
                slug,
                category,
                description,
                headerImage,
                thumbnail,
                credit,
                artist_ids,
                gene_ids,
                tag_id,
                keyword,
                price_guidance,
                show_on_editorial,
                is_featured_artist_content,
                artist_series_label,
                artist_series,
                featured_collections_label,
                featured_collections,
                other_collections_label,
                other_collections,
              })
          )
          resolve(formattedCollections)
        } else {
          resolve([])
        }
      })
      .on("err", reject)
  })
}