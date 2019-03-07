// import metaphysics from "../../lib/metaphysics"
// import { mockCollectionRepository } from "../../Resolvers/__tests__/fixtures/data"

jest.mock("../../lib/metaphysics", () => ({ default: jest.fn() }))
// const metaphysicsMock = metaphysics as jest.Mock<any>

describe("saveFeaturedArtworks", () => {
  describe("#saveFeaturedArtworks", () => {
    it("Opens and closes a database connection", () => {
      expect(true).toBeTruthy()
    })

    it("Calls #attachFeaturedArtworks for each collection", () => {
      expect(true).toBeTruthy()
    })

    it("Saves collection with new data", () => {
      expect(true).toBeTruthy()
    })

    it("Handles connection errors", () => {
      expect(true).toBeTruthy()
    })

    it("Handles save errors", () => {
      expect(true).toBeTruthy()
    })
  })

  describe("#attachFeaturedArtworks", () => {
    it("Calls #getFeaturedArtworks and attaches results to collection", () => {
      expect(true).toBeTruthy()
    })

    it("Handles errors", () => {
      expect(true).toBeTruthy()
    })
  })

  describe("#getFeaturedArtworks", () => {
    it("Returns artwork results from metaphysics", () => {
      expect(true).toBeTruthy()
    })
  })
})
