import "dotenv/config"
import { saveFeaturedArtworks } from "../src/utils/saveFeaturedArtworks"

saveFeaturedArtworks().catch(error => {
  console.log(error)
  process.exit(1)
})
