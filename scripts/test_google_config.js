require("dotenv").config()
const { google } = require("googleapis")
const color = require('bash-color')
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SPREADSHEET_IDS_ALLOWLIST } = process.env

const FAILURE_REASONS = {
  needs_id: `You must specify a ${color.yellow('GOOGLE_CLIENT_ID')}; this may be a numeric value or an email address of an account with access!`,
  needs_secret: `You must specify a ${color.yellow('GOOGLE_CLIENT_SECRET')}; this should be in the form of a private SSH key, and should include \\n tokens on linebreaks.`,
  needs_spreadsheet: `You must specify a ${color.yellow('SPREADSHEET_IDS_ALLOWLIST')} - this should be the ID of the spreadsheet you're trying to access.`,
  authorization_failed: `The ${color.yellow('GOOGLE_CLIENT_ID')} and ${color.yellow('GOOGLE_CLIENT_SECRET')} you provided are being rejected. See console output for more information.`,
  google_access: `Although ${color.green('authentication to google succeeded')}, the ${color.red('query to google sheets failed')}. See console output for more information.`
}

const reasons = []
const fail = reasons => {
  console.error("Unable to successfully interface with Google Sheets API given the following errors:")
  reasons.forEach(reason => console.log(`\t- ${FAILURE_REASONS[reason]}`))
  process.exit(1)
}

if (!GOOGLE_CLIENT_ID) { reasons.push('needs_id') }
if (!GOOGLE_CLIENT_SECRET) { reasons.push('needs_secret') }
if (!SPREADSHEET_IDS_ALLOWLIST) { reasons.push('needs_spreadsheet') }
if (reasons.length > 0) { fail(reasons) }

const config = {
  id: GOOGLE_CLIENT_ID,
  keyfile: "",
  secret: GOOGLE_CLIENT_SECRET.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"]
}

const runTest = () => {
  authorize()
    .then(client => {
      const sheets = google.sheets({ version: "v4", auth: client })
      confirmAccess(sheets)
    }).catch(e => {
      fail([...reasons, 'authorization_failed'])
    })
}

const authorize = () => {
  const promise = new Promise((resolve, reject) => {
    const { id, keyfile, secret, scopes } = config
    const jwtClient = new google.auth.JWT(id, keyfile, secret, scopes)

    jwtClient
      .authorize((err) => {
        if (err) {
          console.log('[ERROR]', err.message)
          reject(err)
        } else {
          resolve(jwtClient)
        }
      })
  })

  promise.catch(e => { throw (e) })
  return promise
}

const confirmAccess = sheets => {
  sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_IDS_ALLOWLIST,
    range: "debug"
  },
    (err, res) => {
      if (err) {
        console.log('[ERROR]', err.message)
        reasons.push('google_access')
        fail([...reasons, 'google_access'])
      }
      const [_, ...data] = res.data.values
      console.log(`${color.green("Success!")} You have loaded the debug spreadsheet, which currently contains ${data.length} records.`)
      console.log(`If this works here but is failing on prod remember you have to run ${color.purple('hokusai production refresh', true)} to get it to read in updated environment variables!")`)
      process.exit(0)
    })
}

runTest()