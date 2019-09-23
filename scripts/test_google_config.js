const { google } = require("googleapis")
const color = require('bash-color')
require("dotenv").config()
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SPREADSHEET_IDS_ALLOWLIST } = process.env

const reasons = []
const fail = reasons => {
  console.log("Unable to successfully interface with Google Sheets API given the following errors:")
  reasons.forEach(reason => console.log(`\t- ${reason}`))
  process.exit(1)
}

if (!GOOGLE_CLIENT_ID) {
  reasons.push(`You must specify a ${color.yellow('GOOGLE_CLIENT_ID')}; this may be a numeric value or an email address of an account with access!`)
}

if (!GOOGLE_CLIENT_SECRET) {
  reasons.push(`You must specify a ${color.yellow('GOOGLE_CLIENT_SECRET')}; this should be in the form of a private SSH key, and should include \\n tokens on linebreaks.`)
}

if (!SPREADSHEET_IDS_ALLOWLIST) {
  reasons.push(`You must specify a ${color.yellow('SPREADSHEET_IDS_ALLOWLIST')} - this should be the ID of the spreadsheet you're trying to access.`)
}

if (reasons.length > 0) {
  fail(reasons)
}

const getClient = () => {
  authorize()
    .then(client => {
      const sheets = google.sheets({ version: "v4", auth: client })
      do_stuff(sheets)
    }).catch(e => {
      reasons.push(e.message)
      process.exit(1)
    })
}

const authorize = () => {
  return new Promise((resolve, reject) => {
    const jwtClient = new google.auth.JWT(
      GOOGLE_CLIENT_ID,
      "",
      GOOGLE_CLIENT_SECRET.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/spreadsheets"]
    )

    jwtClient.authorize((err, tokens) => {
      if (err) {
        console.log("Error authorizing!")
        console.log(err)
        reject(err)
      } else {
        resolve(jwtClient)
      }
    })
  })
    .catch(e => { throw (e) })
}

const do_stuff = sheets => {
  sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_IDS_ALLOWLIST,
    range: "debug"
  },
    (err, res) => {
      if (err) {
        fail([`${color.red("error")}: ${err.message}`])
        process.exit(1)
      }
      const [_, ...data] = res.data.values
      console.log(`${color.green("Success!")} You have loaded the debug spreadsheet, which currently contains ${data.length} records.`)
      console.log(`If this works here but is failing on prod remember you have to run ${color.purple('hokusai production refresh', true)} to get it to read in updated environment variables!")`)
      process.exit(0)
    })
}

getClient()