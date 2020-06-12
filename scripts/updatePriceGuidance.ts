import "dotenv/config"
import { updatePriceGuidance } from "../src/utils/updatePriceGuidance"

updatePriceGuidance()
  .then(() => {
    process.exit(0)
  })
  .catch(error => {
    console.log(`Encountered unhandled error: ${error.message}`)
    process.exit(1)
  })
