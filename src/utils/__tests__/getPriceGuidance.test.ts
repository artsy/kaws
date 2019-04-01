import { getBasePrice } from "../getPriceGuidance"
jest.mock("../../lib/metaphysics", () => ({
  metaphysics: jest.fn(),
}))

const mockMetaphysics = require("../../lib/metaphysics").metaphysics

describe("#getPriceGuidance", () => {
  it("calculates the average of the 3 lowest artworks of a collection", async () => {
    const results = {
      marketingCollection: {
        artworks: {
          hits: [
            {
              price: "$295",
              is_price_range: false,
            },
            {
              price: "$550",
              is_price_range: false,
            },
            {
              price: "$650",
              is_price_range: false,
            },
          ],
        },
      },
    }

    mockMetaphysics.mockResolvedValue(results)
    const avgPrice = await getBasePrice("kaws-companions")

    expect(mockMetaphysics.mock.calls[0][0]).toContain("kaws-companions")
    expect(avgPrice).toEqual(498)
  })
})
