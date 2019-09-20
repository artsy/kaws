import { google } from "googleapis"

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error(
    "[kaws] Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in env variables"
  )
  process.exit(1)
}

export const gSheetDataFetcher = async (
  spreadsheetID: string,
  sheetName: string
) => {
  let jwtClient
  try {
    jwtClient = await authorize()
  } catch (e) {
    console.dir(e.message)
    throw new Error(
      "Error generating JWT client for google - ensure your GOOGLE_CLIENT_SECRET is a single string with `\\n` for each linebreak. See console output for full error message."
    )
  }

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
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env

  return new Promise((resolve, reject) => {
    const jwtClient = new google.auth.JWT(
      GOOGLE_CLIENT_ID,
      "",
      (GOOGLE_CLIENT_SECRET as string).replace(/\\n/g, "\n"),
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
