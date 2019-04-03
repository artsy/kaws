import { reduce } from "lodash"
import metaphysics from "../lib/metaphysics"
// I notice when I don't require the metaphysics module
// like below the test git satfails
// const metaphysics = require("../lib/metaphysics").metaphysics
const currency = require("currency.js")

const formatCurrency = value => currency(value, { separator: "" }).format()

export const getPriceGuidance = async (slug: string) => {
  const results: any = await metaphysics(`{
    marketingCollection(slug: "${slug}") {
      artworks(
        size: 3,
        sort: "prices",
        acquireable: true
      ) { 
        hits {
          price
        }
      }
    }
  }`)
  let avgPrice
  let hasNoBasePrice
  try {
    hasNoBasePrice =
      !results.marketingCollection ||
      results.marketingCollection.artworks.hits.length !== 3

    if (hasNoBasePrice) {
      avgPrice = null
    } else {
      avgPrice =
        reduce(
          results.marketingCollection.artworks.hits,
          (sum, { price }) => {
            return sum + parseInt(formatCurrency(price), 10)
          },
          0
        ) / results.marketingCollection.artworks.hits.length
    }
  } catch (error) {
    throw error
  }

  return hasNoBasePrice ? avgPrice : parseInt(avgPrice, 10)
}
