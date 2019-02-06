// const { METAPHYSICS_URL, X_USER_ID, X_ACCESS_TOKEN } = process.env
const fetch = require("node-fetch")
import { NetworkError } from "./utils/errors"

type Payload =
  | { query: string; variables?: object }
  | { documentID: string; variables?: object }

export function request(
  payload: Payload,
  checkStatus: boolean = true
): Promise<Response> {
  return fetch("https://metaphysics-staging.artsy.net/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "KAWS",
      "X-USER-ID": "5744b8888b3b8145d7005304",
      "X-ACCESS-TOKEN":
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NzQ0Yjg4ODhiM2I4MTQ1ZDcwMDUzMDQiLCJzYWx0X2hhc2giOiIxZjEyMWUyZWE4ZjU2YWE3NzA5YzZhYTI3YjA2N2ZkMyIsInJvbGVzIjoidXNlcixhZG1pbiIsInBhcnRuZXJfaWRzIjpbXSwiZXhwIjoxNTUyODQwODM4LCJpYXQiOjE1NDc2NTY4MzgsImF1ZCI6IjRlMzZlZmE0ZGI0ZTMyMDAwMTAwMDM1OSIsImlzcyI6IkdyYXZpdHkiLCJqdGkiOiI1YzNmNWU4NjM5NWZhNDI1N2QxZWQ5NzkifQ.G3QfEwSxnxpQu19fdarZeGWUmfWbhBz7B7XQee8bfTk",
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
  return (
    request(payload, checkStatus)
      .then<T & { errors: any[] }>(response => response.json())
      // TODO: This is here because existing callers may rely on this, but it’s now duplicated here and in fetchQuery.ts
      .then(json => {
        if (json.errors) {
          json.errors.forEach(console.error)
          // Throw here so that our error view gets shown.
          // See https://github.com/facebook/relay/issues/1913
          throw new Error("Server-side error occurred")
        }
        return json
      })
  )
}

export default function query<T>(url: string): Promise<T> {
  return metaphysics<{ data: T }>({ query: url }).then(({ data }) => data)
}
