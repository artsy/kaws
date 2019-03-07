import metaphysics from "../lib/metaphysics"

export const getArtworks = async (query: string) => {
  const results: any = await metaphysics(`${query}`)
  let artworkArray
  let artistArray
  try {
    artworkArray = results.marketingCollection.artworks.hits.map(x => x.id)
    artistArray = results.marketingCollection.artworks.hits.map(
      x => x.artist.id
    )
  } catch (error) {
    throw error
  }
  return [artworkArray, artistArray]
}
