import * as bodyParser from "body-parser"
import * as express from "express"
import { gSheetDataFetcher } from "../utils/gSheetDataFetcher"
import { sanitizeRow } from "../utils/sanitizeRow"
import { updateDatabase } from "../utils/updateDatabase"

const app = express()

app.use(bodyParser.json())

export const upload = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { spreadSheetID, sheetName } = req.body

  if (!spreadSheetID || !sheetName) {
    return res
      .status(500)
      .send("A valid spreadSheetID and sheetName is required")
  }

  const data: object[] = await gSheetDataFetcher(spreadSheetID, sheetName)

  const rows = data.slice(1).map((row: string[]) => {
    const [
      title,
      slug,
      category,
      description,
      headerImage,
      credit,
      artist_ids,
      gene_ids,
      tag_id,
      keyword,
      price_guidance,
      show_on_editorial,
      is_featured_artist_content,
    ] = row

    return sanitizeRow({
      title,
      slug,
      category,
      description,
      headerImage,
      credit,
      artist_ids,
      gene_ids,
      tag_id,
      keyword,
      price_guidance,
      show_on_editorial,
      is_featured_artist_content,
    })
  })
  updateDatabase(rows)

  res.send(200)
}

app.post("/upload", upload)

export default app
