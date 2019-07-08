import * as csv from "csv-parser"
import * as fs from "fs"
import { Collection } from "../Entities/Collection"
import { sanitizeRow } from "./sanitizeRow"

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
      .on("end", () => {
        if (results.length > 0) {
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
