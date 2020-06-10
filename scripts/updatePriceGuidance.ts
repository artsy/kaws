import "dotenv/config"
import { updatePriceGuidance } from "../src/utils/updatePriceGuidance"

updatePriceGuidance().catch(error => {
  console.log(error)
  process.exit(1)
})
