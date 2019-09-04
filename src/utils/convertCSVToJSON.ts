import * as csv from "csv-parser"
import * as fs from "fs"
import { Collection } from "../Entities/Collection"
import { validateAndSanitizeInput } from "./processInput"

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
          try {
            const formattedCollections = validateAndSanitizeInput(results)
            resolve(formattedCollections)
          } catch (e) {
            reject(e)
          }
        } else {
          resolve([])
        }
      })
      .on("err", reject)
  })
}
