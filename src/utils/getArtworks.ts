import metaphysics from "../lib/metaphysics"

// ah ok artistsearchresponse is the type. What is my type here?
export const searchForQuery = async (query: string) => {
  const results = await metaphysics(`${query}`)
  console.log(results)
}

searchForQuery(`
query {
  artist(id:"kaws") {
    bio
  }
}
`)
