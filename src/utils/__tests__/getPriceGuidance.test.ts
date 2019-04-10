import { getPriceGuidance } from "../getPriceGuidance"

jest.mock("../../lib/metaphysics", () => ({
  default: jest.fn(),
}))

const mockMetaphysics = require("../../lib/metaphysics").default

describe("#getPriceGuidance", () => {
  it("calculates the average of the 3 lowest artworks of a collection", async () => {
    const results = {
      marketingCollection: {
        artworks: {
          hits: [
            {
              price: "$225",
            },
            {
              price: "$225",
            },
            {
              price: "$295",
            },
            {
              price: "$350",
            },
            {
              price: "$360",
            },
          ],
        },
      },
    }

    mockMetaphysics.mockResolvedValue(results)
    const avgPrice = await getPriceGuidance("kaws-companions")

    expect(mockMetaphysics.mock.calls[0][0]).toContain("kaws-companions")
    expect(avgPrice).toEqual(300)
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
    const avgPrice = await getPriceGuidance("josef-albers-never-before")

    expect(mockMetaphysics.mock.calls[0][0]).toContain("kaws-companions")
    expect(avgPrice).toEqual(null)
  })
})
