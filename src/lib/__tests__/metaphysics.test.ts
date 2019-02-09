import "dotenv/config"
import metaphysics from "../metaphysics"

jest.mock("node-fetch")
import fetch from "node-fetch"

const { METAPHYSICS_URL } = process.env

it("Adds a user agent", async () => {
  fetch.mockReturnValue(
    Promise.resolve({ status: 200, json: () => Promise.resolve({ data: {} }) })
  )
  expect.assertions(1)

  return metaphysics("query {}").then(() => {
    expect(fetch).toBeCalledWith(METAPHYSICS_URL, {
      body: '{"query":"query {}"}',
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "KAWS",
      },
      method: "POST",
    })
  })
})
