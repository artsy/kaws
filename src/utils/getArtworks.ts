import metaphysics from "../lib/metaphysics"

export const getArtworks = async (query: string) => {
  const results: any = await metaphysics(`${query}`)
  let artworkArray
  try {
    artworkArray = results.marketingCollection.artworks.hits.map(x => x.id)
  } catch (error) {
    throw error
  }
  return artworkArray
}
