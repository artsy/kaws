import { reduce, trim } from "lodash"
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
          is_price_range
        }
      }
    }
  }`)
  let avgPrice
  try {
    const artworks = results.marketingCollection.artworks.hits

    if (artworks.length !== 3) {
      avgPrice = null
    } else {
      avgPrice =
        reduce(
          artworks,
          (sum, { is_price_range, price }) => {
            const formatablePrice = !is_price_range
              ? price
              : // handle price range by grabbing the first price in the range
                trim(price.split("-")[0])
            return sum + parseInt(formatCurrency(formatablePrice), 10)
          },
          0
        ) / artworks.length
    }
  } catch (error) {
    throw error
  }

  return parseInt(avgPrice, 10)
}
