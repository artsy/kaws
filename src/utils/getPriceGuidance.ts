import { flatMap, reduce } from "lodash"
import metaphysics from "../lib/metaphysics"

export const getPriceInDollars = priceCents => {
  if (priceCents && priceCents.min) {
    return priceCents.min / 100
  } else if (priceCents && priceCents.max) {
    return priceCents.max / 100
  } else {
    return null
  }
}

export const getPriceGuidance = async (slug: string) => {
  try {
    const results: any = await metaphysics(`{
      marketingCollection(slug: "${slug}") {
        artworks(
          size: 5,
          sort: "prices",
          price_range: "10-*"
        ) { 
          hits {
            price
            priceCents {
              min
              max
            }
          }
        }
      }
    }`)
    let avgPrice
    let hasNoBasePrice
    const collectionPricesInDollars = flatMap(
      results.marketingCollection.artworks.hits,
      artwork => {
        return getPriceInDollars(artwork.priceCents)
      }
    ).filter(Boolean)

    hasNoBasePrice = !(collectionPricesInDollars.length > 0)

    if (hasNoBasePrice) {
      avgPrice = null
    } else {
      avgPrice =
        reduce(
          collectionPricesInDollars,
          (sum, price) => {
            // @ts-ignore
            return sum + price
          },
          0
        ) / collectionPricesInDollars.length
    }

    return hasNoBasePrice ? avgPrice : Math.ceil(avgPrice / 100) * 100
  } catch (error) {
    console.log(error)
  }
}
