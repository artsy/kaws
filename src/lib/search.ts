const { NODE_ENV, ELASTICSEARCH_URL } = process.env
const elasticsearch = require("elasticsearch")

if (!ELASTICSEARCH_URL) {
  throw new Error("ELASTICSEARCH_URL not defined, skipping...")
}

const client = new elasticsearch.Client({
  host: ELASTICSEARCH_URL,
  maxRetries: 2,
  keepAlive: true,
  maxSockets: 10,
})

export const search = {
  index: "marketing_collections_" + NODE_ENV,
  client,
}
