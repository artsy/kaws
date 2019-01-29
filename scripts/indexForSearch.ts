import "dotenv/config"
import { indexForSearch } from "../src/utils/indexForSearch"

indexForSearch().catch(error => {
  console.log(error)
  process.exit(1)
})
