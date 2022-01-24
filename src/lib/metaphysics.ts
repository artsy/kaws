import "dotenv/config"
import { NetworkError } from "./utils/errors"

const { METAPHYSICS_URL } = process.env
import fetch from "node-fetch"

type Payload =
  | { query: string; variables?: object }
  | { documentID: string; variables?: object }

export async function request(payload: Payload, checkStatus: boolean = true) {
  const response = await fetch(METAPHYSICS_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "KAWS",
    },
    body: JSON.stringify(payload),
  })

  if (!checkStatus || (response.status >= 200 && response.status < 300)) {
    return response
  } else {
    const error = new NetworkError(response.statusText)
    error.response = response
    throw error
  }
}

export async function metaphysics<T>(
  payload: Payload,
  checkStatus: boolean = true
): Promise<T> {
  const response = await request(payload, checkStatus)
  const json = (await response.json()) as T & { errors: any[] }

  if (json.errors) {
    json.errors.forEach(console.error)
    // Throw here so that our error view gets shown.
    // See https://github.com/facebook/relay/issues/1913
    throw new Error("Server-side error occurred")
  }

  return json
}

export default function query<T>(url: string): Promise<T> {
  return metaphysics<{ data: T }>({ query: url }).then(({ data }) => data)
}
