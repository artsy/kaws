import metaphysics from "../lib/metaphysics"

export const getArtists = async (query: string) => {
  const results: any = await metaphysics(`${query}`)
  let artistArray
  try {
    artistArray = results.marketingCollection.artworks.hits.map(
      x => x.artist.id
    )
  } catch (error) {
    throw error
  }
  const seen = {}
  return artistArray.filter(item => {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true)
  })
}
