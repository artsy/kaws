/*
* Makes sure that any http requests get redirected to https
*/
const { APP_URL } = process.env

export const ensureSSL = (req, res, next) => {
  /*
  * req.secure is a boolean that return if the request protocol is 'https'
  * https://expressjs.com/en/api.html#req.secure
  * 
  * APP_URL is parsed because req.secure does not work local. APP_URL determines 
  * whether or not we need to make the requestion via https
  */
  if (!req.secure) {
    res.redirect(301, APP_URL + req.url)
  } else {
    next()
  }
}
