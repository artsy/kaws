import "dotenv/config"
import { pushContentToSailthru } from "../src/utils/updateSailthru"

pushContentToSailthru().catch(error => {
  console.log(error)
  process.exit(1)
})
