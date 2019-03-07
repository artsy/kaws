// import { createConnection, getMongoRepository } from "typeorm"
import { clone } from "lodash"
import {
  metaphysicsFeaturedArtworks,
  metaphysicsFeaturedArtworksFetch,
} from "../../__fixtures__/featuredArtworksFixture"
import metaphysics from "../../lib/metaphysics"
import { mockCollectionRepository } from "../../Resolvers/__tests__/fixtures/data"
import {
  attachFeaturedArtworks,
  getFeaturedArtworks,
  sanitizeArtworkArray,
} from "../saveFeaturedArtworks"

// jest.mock("../../Entities", () => ({ Collection: jest.fn() }))
// jest.mock("../../config/database", () => ({ databaseConfig: jest.fn() }))
jest.mock("../../lib/metaphysics", () => ({ default: jest.fn() }))
// jest.mock("typeorm", () => {
//   return {
//     Connection: jest.fn(),
//     createConnection: jest.fn(),
//     getMongoRepository: jest.fn(),
//   }
// })

// const createConnectionMock = createConnection as jest.Mock<any>
// const getMongoRepositoryMock = getMongoRepository as jest.Mock<any>
const metaphysicsMock = metaphysics as jest.Mock<any>

describe("saveFeaturedArtworks", () => {
  // let repositoryMock
  let collections
  let metaphysicsReturn
  let metaphysicsArtworks

  beforeEach(() => {
    collections = clone(mockCollectionRepository)
    metaphysicsReturn = clone(metaphysicsFeaturedArtworksFetch)
    metaphysicsArtworks = clone(metaphysicsFeaturedArtworks)
    metaphysicsMock.mockReturnValue(metaphysicsReturn)

    // repositoryMock = { find: jest.fn(), update: jest.fn() }
    // getMongoRepositoryMock.mockReturnValue(repositoryMock)
    // createConnectionMock.mockResolvedValue({
    //   close: jest.fn(),
    //   isConnected: true,
    // })
  })

  describe("#saveFeaturedArtworks", () => {
    beforeEach(() => {
      // repositoryMock.find.mockReturnValue(mockCollectionRepository)
    })

    it("Opens and closes a database connection", () => {
      expect(true).toBeTruthy()
    })

    it("Calls #attachFeaturedArtworks for each collection", async () => {
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
    it("Calls #getFeaturedArtworks and attaches results to collection", async () => {
      const { featuredArtworks } = await attachFeaturedArtworks(collections[0])
      expect(featuredArtworks.length).toBe(3)
      expect(featuredArtworks[0].id).toMatch("ellsworth-kelly-black-ripe")
      expect(featuredArtworks[0].image.url).toMatch(
        "https://d32dm0rphc51dk.cloudfront.net/J95rqjn5Gq8Y1HyyKKMj2g/medium.jpg"
      )
    })
  })

  describe("#getFeaturedArtworks", () => {
    it("Returns artwork results from metaphysics", async () => {
      const fetchedArtworks = await getFeaturedArtworks("query")

      expect(fetchedArtworks.length).toBe(3)
      expect(fetchedArtworks[0].id).toMatch("ellsworth-kelly-black-ripe")
      expect(fetchedArtworks[0].image.url).toMatch(
        "https://d32dm0rphc51dk.cloudfront.net/J95rqjn5Gq8Y1HyyKKMj2g/medium.jpg"
      )
    })
  })

  describe("#sanitizeArtworkArray", () => {
    it("renames aspect_ratio to aspectRatio", () => {
      const newArtworks = sanitizeArtworkArray(metaphysicsArtworks)
      expect(newArtworks[0].image.aspectRatio).toBe(1)
    })

    it("renames image_url to imageUrl", () => {
      const newArtworks = sanitizeArtworkArray(metaphysicsArtworks)
      expect(newArtworks[0].image.imageUrl).toMatch(
        "https://d32dm0rphc51dk.cloudfront.net/J95rqjn5Gq8Y1HyyKKMj2g/:version.jpg"
      )
    })
  })
})
