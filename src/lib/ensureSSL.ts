/*
* Makes sure that any http requests get redirected to https
*/

import { parse } from "url"
const { APP_URL } = process.env

export const ensureSSL = (req, res, next) => {
  const protocol = req.protocol
  const isSecure = req.secure || protocol === "https:"

  if (!isSecure && parse(APP_URL as string).protocol === "https:") {
    res.redirect(301, APP_URL + req.url)
  } else {
    next()
  }
}
