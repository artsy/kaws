import { gSheetDataFetcher } from "../src/utils/gSheetDataFetcher"
import { sanitizeRow } from "../src/utils/processInput"
import { updateDatabase } from "../src/utils/updateDatabase"

const { SPREADSHEET_IDS_ALLOWLIST } = process.env

const [spreadSheetID, sheetName] = process.argv.slice(2)

const authorizedIDs = (SPREADSHEET_IDS_ALLOWLIST || "").split(",")

if (!spreadSheetID || !sheetName) {
  console.error("A valid spreadSheetID and sheetName is required")
  process.exit(1)
}

if (!authorizedIDs.includes(spreadSheetID)) {
  console.error("A valid spreadSheetID is required")
  process.exit(1)
}

gSheetDataFetcher(spreadSheetID, sheetName).then((data: object[]) => {
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
    console.log(
      `Updating ${rows.length} records in the database, please wait a few minutes!`
    )
  } catch (e) {
    console.error("There was an error uploading collection data:")
    console.error(e.message)
    process.exit(1)
  }
})
