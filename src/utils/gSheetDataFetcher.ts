import { google } from "googleapis"

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error(
    "[kaws] Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in env variables"
  )
  process.exit(1)
}

export const gSheetDataFetcher = async (
  spreadsheetID: string,
  sheetName: string
) => {
  const jwtClient = await authorize()
  const sheets = google.sheets({ version: "v4", auth: jwtClient })

  return new Promise<object[]>((resolve, reject) => {
    sheets.spreadsheets.values.get(
      {
        spreadsheetId: spreadsheetID,
        range: `'${sheetName}'`,
      },
      (err, res) => {
        if (err) {
          reject(err)
          return console.log("The API returned an error: " + err)
        }
        const rows = res.data.values
        if (rows.length) {
          console.log(`Processing ${rows.length} rows.`)
          resolve(rows)
        } else {
          console.log("No data found.")
          reject([])
        }
      }
    )
  })
}

const authorize = () => {
  return new Promise((resolve, reject) => {
    const jwtClient = new google.auth.JWT(
      GOOGLE_CLIENT_ID,
      "",
      GOOGLE_CLIENT_SECRET,
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

// gSheetDataFetcher("1_lyvVK8Bz-qt3l_kcR2-2xbfr9lz_q3i1G9W77sTcvQ", "'Batch 10'")
