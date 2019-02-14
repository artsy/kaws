import "dotenv/config"
import { NetworkError } from "./utils/errors"

const { METAPHYSICS_URL } = process.env
const fetch = require("node-fetch")

type Payload =
  | { query: string; variables?: object }
  | { documentID: string; variables?: object }

export function request(
  payload: Payload,
  checkStatus: boolean = true
): Promise<Response> {
  return fetch(METAPHYSICS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "KAWS",
    },
    body: JSON.stringify(payload),
  }).then(response => {
    if (!checkStatus || (response.status >= 200 && response.status < 300)) {
      return response
    } else {
      const error = new NetworkError(response.statusText)
      error.response = response
      throw error
    }
  })
}

export function metaphysics<T>(
  payload: Payload,
  checkStatus: boolean = true
): Promise<T> {
  return request(payload, checkStatus)
    .then<T & { errors: any[] }>(response => response.json())
    .then(json => {
      if (json.errors) {
        json.errors.forEach(console.error)
        // Throw here so that our error view gets shown.
        // See https://github.com/facebook/relay/issues/1913
        throw new Error("Server-side error occurred")
      }
      return json
    })
}

export default function query<T>(url: string): Promise<T> {
  return metaphysics<{ data: T }>({ query: url }).then(({ data }) => data)
}
