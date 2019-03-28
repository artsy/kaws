import { google } from "googleapis"

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env

// https://developers.google.com/sheets/api/quickstart/nodejs?authuser=1

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]

export const gSheetDataFetcher = (sheetID: string) => {
  const oAuth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET
  )

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  })
}
