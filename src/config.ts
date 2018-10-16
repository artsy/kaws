require("dotenv").config({
  path: require("path").join(process.cwd(), ".env"),
})

const { DD_TRACER_SERVICE_NAME, DD_TRACER_HOSTNAME, NODE_ENV } = process.env

export default {
  DD_TRACER_SERVICE_NAME,
  DD_TRACER_HOSTNAME,
  PRODUCTION_ENV: NODE_ENV === "production",
}
