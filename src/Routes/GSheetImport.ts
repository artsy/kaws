import * as bodyParser from "body-parser"
import * as express from "express"
import { gSheetDataFetcher } from "../utils/gSheetDataFetcher"
import { sanitizeRow } from "../utils/processInput"
import { updateDatabase } from "../utils/updateDatabase"

const { SPREADSHEET_IDS_ALLOWLIST } = process.env

const app = express()

app.use(bodyParser.json())

export const upload = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { spreadSheetID, sheetName } = req.body
  const authorizedIDs = (SPREADSHEET_IDS_ALLOWLIST || "").split(",")

  if (!spreadSheetID || !sheetName) {
    return res
      .status(500)
      .send("A valid spreadSheetID and sheetName is required")
  }

  if (!authorizedIDs.includes(spreadSheetID)) {
    return res.status(500).send("A valid spreadSheetID is required")
  }

  let data: object[]
  try {
    data = await gSheetDataFetcher(spreadSheetID, sheetName)
  } catch (e) {
    console.log(e.message)
    console.dir(e)
    return res.status(500).send(e.message)
  }

  const rows = data.slice(1).map((row: string[]) => {
    const [
      title,
      slug,
      category,
      description,
      headerImage,
      thumbnail,
      credit,
      artist_ids,
      gene_ids,
      tag_id,
      keyword,
      price_guidance,
      show_on_editorial,
      is_featured_artist_content,
      artist_series_label,
      artist_series,
      featured_collections_label,
      featured_collections,
      other_collections_label,
      other_collections,
      featured_artist_exclusion_ids,
    ] = row

    return sanitizeRow({
      title,
      slug,
      category,
      description,
      headerImage,
      thumbnail,
      credit,
      artist_ids,
      gene_ids,
      tag_id,
      keyword,
      price_guidance,
      show_on_editorial,
      is_featured_artist_content,
      artist_series_label,
      artist_series,
      featured_collections_label,
      featured_collections,
      other_collections_label,
      other_collections,
      featured_artist_exclusion_ids,
    })
  })

  try {
    updateDatabase(rows)
    res
      .status(200)
      .send(
        `Updating ${
          rows.length
        } records in the database, please wait a few minutes!`
      )
  } catch (e) {
    console.log("There was an error uploading collection data.")
    console.log(e.message)
    res.status(500).send(e.message)
  }
}

app.post("/upload", upload)

export default app
