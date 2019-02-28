import * as csv from "csv-parser"
import * as fs from "fs"
import { Collection } from "../Entities/Collection"

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
              credit,
              artist_ids,
              gene_ids,
              tag_id,
              keyword,
              price_guidance,
              show_on_editorial = false,
              is_featured_artist_content = false,
            }) =>
              ({
                title,
                slug: sanitizeSlug(slug),
                category,
                description,
                headerImage,
                credit,
                price_guidance: price_guidance ? Number(price_guidance) : null,
                show_on_editorial: Boolean(show_on_editorial),
                is_featured_artist_content: Boolean(show_on_editorial),
                query: (artist_ids || gene_ids || tag_id || keyword) && {
                  artist_ids: artist_ids
                    ? artist_ids.split(",").map(a => a.trim())
                    : [],
                  gene_ids: gene_ids
                    ? gene_ids.split(",").map(a => a.trim())
                    : [],
                  tag_id,
                  keyword,
                },
              } as Collection)
          )

          resolve(formattedCollections)
        } else {
          resolve([])
        }
      })
      .on("err", reject)
  })
}

export const sanitizeSlug = (slug: string) => {
  const cleanedSlug = slug
    .replace(/ /g, "")
    .replace(/[.,&:\/#!$%\^\*;{}=_`’~()]/g, "")
  return cleanedSlug.toLowerCase()
}
