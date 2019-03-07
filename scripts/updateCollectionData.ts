import "dotenv/config"
import { saveContentToCollections } from "../src/utils/saveContentToCollections"

saveContentToCollections().catch(error => {
  console.log(error)
  process.exit(1)
})
