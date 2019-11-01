import { sanitizeString } from "../processInput"

describe("processInput", () => {
  describe("sanitizeString", () => {
    it.each`
      value           | expected
      ${"some-value"} | ${"some-value"}
      ${undefined}    | ${null}
      ${""}           | ${null}
    `("returns $expected when value is $value", ({ value, expected }) => {
      const result = sanitizeString(value)

      expect(result).toEqual(expected)
    })
  })
})
