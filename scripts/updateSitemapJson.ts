import "dotenv/config"

import { Collection } from "../src/Entities"
import { loadCsvAsCollection } from "./loadCsvAsColleciton"

const AWS = require("aws-sdk")

const S3_COLLECT_BUCKET = "artsy-data"
const S3_COLLECT_KEY = "collect/collect_and_collections.json"
const ACL_FOR_OBJECT = "public-read"

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env

const S3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
})

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

const csvFile = process.argv[2]

loadCsvAsCollection(csvFile).then((collection: Collection[]) => {
  const collectionPaths = collection.map(
    element => `/collection/${element.slug}`
  )
  const allPathsForCollectAndCollections = COLLECT_PATHS.concat(collectionPaths)

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
        console.error(err)
        process.exit(1)
      } else {
        console.log(
          "Successfully updated sitemap:",
          JSON.stringify(data, null, 2)
        )
        console.log("")
      }
    }
  )
})
