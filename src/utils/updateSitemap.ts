import * as AWS from "aws-sdk"
import "dotenv/config"
import { Connection, createConnection, getMongoRepository } from "typeorm"

import { databaseConfig } from "../config/database"
import { Collection } from "../Entities"

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env

const S3_COLLECT_BUCKET = "artsy-data"
const S3_COLLECT_KEY = "collect/collect_and_collections.json"
const ACL_FOR_OBJECT = "public-read"

const COLLECT_PATHS = [
  "/collect",
  "/collect/painting",
  "/collect/photography",
  "/collect/sculpture",
  "/collect/prints",
  "/collect/work-on-paper",
  "/collect/design",
  "/collect/drawing",
  "/collect/installation",
  "/collect/film-slash-video",
  "/collect/jewelry",
  "/collect/performance-art",
  "/collections",
]

export const updateSitemap = async () => {
  let connection: Connection | undefined

  try {
    const connectionArgs = databaseConfig()
    connection = await createConnection(connectionArgs)

    const S3 = new AWS.S3({
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    })

    if (connection.isConnected) {
      const collectionRepository = getMongoRepository(Collection)
      const collections = await collectionRepository.find()
      const collectionPaths = collections.map(el => `/collection/${el.slug}`)
      const allPathsForCollectAndCollections = COLLECT_PATHS.concat(
        collectionPaths
      )

      S3.upload(
        {
          Bucket: S3_COLLECT_BUCKET,
          Key: S3_COLLECT_KEY,
          ACL: ACL_FOR_OBJECT,
          Body: JSON.stringify(allPathsForCollectAndCollections),
          ContentType: "application/json",
        },
        (err, data) => {
          if (err) {
            throw err
          } else {
            console.log(
              "Successfully updated sitemap:",
              JSON.stringify(data, null, 2)
            )
            console.log("")
          }
        }
      )
    } else {
      throw new Error("could not connect to database")
    }
  } finally {
    /* tslint:disable:no-unused-expression */
    connection && connection.close()
    /* tslint:enable:no-unused-expression */
  }
}
