import algoliasearch from "algoliasearch"

const { NODE_ENV, ALGOLIA_APP_ID, ALGOLIA_API_KEY } = process.env

if (!ALGOLIA_APP_ID || !ALGOLIA_API_KEY) {
  throw new Error("ALGOLIA_APP_ID or ALGOLIA_API_KEY not defined, skipping...")
}

// in the Algolia project `KawsCollection` will be the name of the legacy index,
// and `MarketingCollection` will be the name of the new index from Gravity
const algoliaIndexName = process.env.ALGOLIA_INDEX_NAME || "KawsCollection"

const algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY)
const algoliaIndex = algoliaClient.initIndex(
  [algoliaIndexName, NODE_ENV].join("_")
)

export const algoliaSearch = {
  index: algoliaIndex,
  client: algoliaClient,
}

export const algoliaSetSettings = async () => {
  await algoliaIndex.setSettings({
    searchableAttributes: [
      "unordered(name)",
      "unordered(keyword)",
      "unordered(category)",
    ],
    customRanking: ["desc(search_boost)"],
  })
}
