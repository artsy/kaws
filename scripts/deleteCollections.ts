import { CollectionRemover } from "../src/lib/utils/collectionRemover"

const slugs = process.argv.slice(2)
console.log(
  `Attempting to remove ${slugs.length} collection(s) from Elasticsearch and MongoDB`
)

const collectionRemover = new CollectionRemover(slugs)

collectionRemover.setup().then(() => {
  collectionRemover.perform().finally(() => {
    collectionRemover.teardown()
  })
})
