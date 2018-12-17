import * as csv from "csv-parser"
import * as fs from "fs"
import { Collection } from "../src/Entities"

export const loadCsvAsCollection = file => {
  if (!file) {
    throw new Error("Must pass a collections csv file as an argument")
  }

  const results: any[] = []

  return new Promise((resolve, reject) => {
    fs.createReadStream(file)
      .pipe(csv())
      .on("data", data => results.push(data))
      .on("end", () => {
        try {
          if (results.length > 0) {
            const formattedCollections = results.map(result => {
              return {
                title: result.title,
                slug: result.slug,
                category: result.category,
                description: result.description,
                headerImage: result.headerImage,
                credit: result.credit,
                query: {
                  artist_ids: result.artist_ids,
                  gene_ids: result.gene_ids,
                  tag_id: result.tag_id,
                  keyword: result.keyword,
                },
              }
            })

            resolve(formattedCollections as Collection[])
          }

          resolve(results)
        } catch (error) {
          reject(error)
        }
      })
  }).catch(error => {
    console.error(error)
    process.exit(1)
  })
}
