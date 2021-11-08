const elasticsearch = require("elasticsearch")

const { NODE_ENV, ELASTICSEARCH_URL } = process.env

if (!ELASTICSEARCH_URL) {
  throw new Error("ELASTICSEARCH_URL not defined, skipping...")
}

const client = new elasticsearch.Client({
  host: ELASTICSEARCH_URL,
  maxRetries: 2,
  keepAlive: true,
  maxSockets: 10,
})

// in the Elasticsearch cluster `kaws_collection` will be the name of the legacy
// index, and `marketing_collection` will be the name of the new index from Gravity
const indexName =
  process.env.ELASTICSEARCH_INDEX_NAME || "marketing_collections"

export const search = {
  index: [indexName, NODE_ENV].join("_"),
  client,
}
