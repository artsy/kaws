import { reduce } from "lodash"
const { metaphysics } = require("../lib/metaphysics")
const currency = require("currency.js")

const formatCurrency = value => currency(value, { separator: "" }).format()

export const getBasePrice = async (slug: string) => {
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
  let artworks
  try {
    artworks = results.marketingCollection.artworks.hits

    if (artworks.length !== 3) {
      avgPrice = null
    } else {
      avgPrice =
        reduce(
          artworks,
          (sum, { price }) => {
            return sum + parseInt(formatCurrency(price), 10)
          },
          0
        ) / artworks.length
    }
  } catch (error) {
    throw error
  }

  return artworks.length === 3 ? parseInt(avgPrice, 10) : avgPrice
}
