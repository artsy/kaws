import "dotenv/config"
import { updateSitemap } from "../src/utils/updateSitemap"

updateSitemap().catch(error => {
  console.log(error)
  process.exit(1)
})
