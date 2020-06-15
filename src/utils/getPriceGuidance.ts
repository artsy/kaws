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

export const generateQuery = (slug: string) => `{
  marketingCollection(slug: "${slug}") {
    artworks(aggregations: [TOTAL], price_range: "10-*", sort: "-has_price,prices") {
      artworks_connection(first: 5) {
        edges {
          node {
            artist {
              name
            }
            title
            price
            priceCents {
              min
              max
            }
          }
        }
      }
    }
  }
}`

export const getPriceGuidance = async (slug: string) => {
  try {
    const results: any = await metaphysics(generateQuery(slug))
    let avgPrice
    let hasNoBasePrice

    const collectionPricesInDollars = flatMap(
      results.marketingCollection.artworks.artworks_connection.edges,
      ({ node }) => {
        return getPriceInDollars(node.priceCents)
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
    throw error
  }
}
