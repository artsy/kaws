import { google } from "googleapis"

const { GOOGLE_JWT } = process.env
const credentials = require("../../gcloud-credentials.json")

// https://developers.google.com/sheets/api/quickstart/nodejs?authuser=1

export const gSheetDataFetcher = async (sheetID: string) => {
  console.log("jwt", GOOGLE_JWT!)
  const jwtClient = await authorize()
  const sheets = google.sheets({ version: "v4", auth: jwtClient })
  sheets.spreadsheets.values.get(
    {
      spreadsheetId: "1_lyvVK8Bz-qt3l_kcR2-2xbfr9lz_q3i1G9W77sTcvQ",
      range: "'Batch 10'",
    },
    (err, res) => {
      if (err) {
        return console.log("The API returned an error: " + err)
      }
      const rows = res.data.values
      if (rows.length) {
        // console.log(rows)
      } else {
        console.log("No data found.")
      }
    }
  )
}

const authorize = () => {
  return new Promise((resolve, reject) => {
    const jwtClient = new google.auth.JWT(
      credentials.client_email,
      "",
      credentials.private_key,
      ["https://www.googleapis.com/auth/spreadsheets"]
    )
    jwtClient.authorize((err, tokens) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        resolve(jwtClient)
      }
    })
  })
}

gSheetDataFetcher("")
