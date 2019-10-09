import { getPriceGuidance, getPriceInDollars } from "../getPriceGuidance"

jest.mock("../../lib/metaphysics", () => ({
  default: jest.fn(),
}))

const mockMetaphysics = require("../../lib/metaphysics").default

describe("#getPriceGuidance", () => {
  afterEach(() => {
    mockMetaphysics.mockClear()
  })
  it("calculates the average of the 5 lowest artworks of a collection rounded to the nearest 100th", async () => {
    const results = {
      marketingCollection: {
        artworks: {
          artworks_connection: {
            edges: [
              {
                node: {
                  priceCents: {
                    min: 22500,
                    max: 22500,
                  },
                },
              },
              {
                node: {
                  priceCents: {
                    min: 22500,
                    max: 22500,
                  },
                },
              },
              {
                node: {
                  priceCents: {
                    min: 29500,
                    max: 29500,
                  },
                },
              },
              {
                node: {
                  priceCents: {
                    min: 35000,
                    max: 35000,
                  },
                },
              },
              {
                node: {
                  priceCents: {
                    min: 36000,
                    max: 36000,
                  },
                },
              },
            ],
          },
        },
      },
    }

    mockMetaphysics.mockResolvedValue(results)
    const avgPrice = await getPriceGuidance("kaws-companions")

    expect(mockMetaphysics.mock.calls[0][0]).toContain("kaws-companions")
    expect(avgPrice).toEqual(300)
  })

  it("returns null when no hits are returned for the collections", async () => {
    const results = {
      marketingCollection: {
        artworks: {
          artworks_connection: { edges: [] },
        },
      },
    }

    mockMetaphysics.mockResolvedValue(results)
    const avgPrice = await getPriceGuidance("josef-albers-never-before")

    expect(mockMetaphysics.mock.calls[0][0]).toContain(
      "josef-albers-never-before"
    )
    expect(avgPrice).toEqual(null)
  })

  it("returns an avgPrice even when priceCents for one or more artworks is null", async () => {
    const results = {
      marketingCollection: {
        artworks: {
          artworks_connection: {
            edges: [
              {
                node: {
                  priceCents: {
                    min: 22500,
                    max: 22500,
                  },
                },
              },
              {
                node: {
                  priceCents: {
                    min: 22500,
                    max: 22500,
                  },
                },
              },
              {
                node: {
                  priceCents: null,
                },
              },
              {
                node: {
                  priceCents: {
                    min: 35000,
                    max: 35000,
                  },
                },
              },
              {
                node: {
                  priceCents: null,
                },
              },
            ],
          },
        },
      },
    }

    mockMetaphysics.mockResolvedValue(results)
    const avgPrice = await getPriceGuidance("kaws-toys")

    expect(mockMetaphysics.mock.calls[0][0]).toContain("kaws-toys")
    expect(avgPrice).toEqual(300)
  })

  it("returns an average price even when there are less than 5 values for priceCents", async () => {
    const results = {
      marketingCollection: {
        artworks: {
          artworks_connection: {
            edges: [
              {
                node: {
                  priceCents: {
                    min: 22500,
                    max: 22500,
                  },
                },
              },
              {
                node: {
                  priceCents: {
                    min: 22500,
                    max: 22500,
                  },
                },
              },
              {
                node: {
                  priceCents: {
                    min: 35000,
                    max: 35000,
                  },
                },
              },
            ],
          },
        },
      },
    }

    mockMetaphysics.mockResolvedValue(results)
    const avgPrice = await getPriceGuidance("kaws-snoopy")

    expect(mockMetaphysics.mock.calls[0][0]).toContain("kaws-snoopy")
    expect(avgPrice).toEqual(300)
  })
})

describe("#getPriceInDollars", () => {
  it("returns the min price in dollars when available", () => {
    const artwork = {
      priceCents: {
        min: 22500,
        max: 40000,
      },
    }

    expect(getPriceInDollars(artwork.priceCents)).toBe(225)
  })

  it("returns the max price in dollars when min price in cents is not available", () => {
    const artwork = {
      priceCents: {
        min: null,
        max: 36900,
      },
    }

    expect(getPriceInDollars(artwork.priceCents)).toBe(369)
  })

  it("returns returns null when the min and max are null", () => {
    const artwork = {
      priceCents: {
        min: null,
        max: null,
      },
    }

    expect(getPriceInDollars(artwork.priceCents)).toBe(null)
  })

  it("returns returns null when the min and max are empty strings", () => {
    const artwork = {
      priceCents: {
        min: "",
        max: "",
      },
    }

    expect(getPriceInDollars(artwork.priceCents)).toBe(null)
  })
})
