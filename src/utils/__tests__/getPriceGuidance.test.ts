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
            },
            {
              price: "$550",
            },
            {
              price: "$650",
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

  it("returns null when the artworks in the collection are not acquireable", async () => {
    const results = {
      marketingCollection: {
        artworks: {
          hits: [],
        },
      },
    }

    mockMetaphysics.mockResolvedValue(results)
    const avgPrice = await getBasePrice("josef-albers-never-before")

    expect(mockMetaphysics.mock.calls[0][0]).toContain("kaws-companions")
    expect(avgPrice).toEqual(null)
  })
})
