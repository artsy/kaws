import { cloneDeep } from "lodash"
import { createConnection, getMongoRepository } from "typeorm"
import {
  metaphysicsFeaturedArtworks,
  metaphysicsFeaturedArtworksFetch,
} from "../../__fixtures__/featuredArtworksFixture"
import metaphysics from "../../lib/metaphysics"
import { mockCollectionRepository as collections } from "../../Resolvers/__tests__/fixtures/data"
import {
  attachFeaturedArtworks,
  getFeaturedArtworks,
  mapQueryToString,
  sanitizeArtworkArray,
  saveFeaturedArtworks,
} from "../saveFeaturedArtworks"

jest.mock("../../Entities", () => ({
  CollectionQuery: jest.fn(),
  ArtworkImage: jest.fn(),
}))
jest.mock("../../Entities/Collection", () => ({
  Collection: jest.fn(),
}))

jest.mock("../../config/database", () => ({ databaseConfig: jest.fn() }))
jest.mock("../../lib/metaphysics", () => ({ default: jest.fn() }))
jest.mock("typeorm", () => {
  return {
    Connection: jest.fn(),
    createConnection: jest.fn(),
    getMongoRepository: jest.fn(),
  }
})

const createConnectionMock = createConnection as jest.Mock<any>
const getMongoRepositoryMock = getMongoRepository as jest.Mock<any>
const metaphysicsMock = metaphysics as jest.Mock<any>

describe("saveFeaturedArtworks", () => {
  let repositoryMock
  let connectionCloseMock
  let ArtworksFixture

  beforeEach(() => {
    ArtworksFixture = cloneDeep(metaphysicsFeaturedArtworks)
    repositoryMock = { find: jest.fn(), update: jest.fn() }
    getMongoRepositoryMock.mockReturnValue(repositoryMock)
    metaphysicsMock.mockReturnValue(metaphysicsFeaturedArtworksFetch)
    connectionCloseMock = jest.fn()
    createConnectionMock.mockResolvedValue({
      close: connectionCloseMock,
      isConnected: true,
    })
  })

  describe("#saveFeaturedArtworks", () => {
    beforeEach(() => {
      repositoryMock.find.mockReturnValue(collections)
    })

    it("Opens and closes a database connection", async () => {
      await saveFeaturedArtworks()
      expect(createConnectionMock).toBeCalled()
      expect(connectionCloseMock).toBeCalled()
    })

    it("Calls #attachFeaturedArtworks and updates each collection with return", async () => {
      await saveFeaturedArtworks()

      const [
        firstCall,
        secondCall,
        thirdCall,
      ] = repositoryMock.update.mock.calls

      expect(repositoryMock.update).toBeCalledTimes(3)
      expect(firstCall[0].slug).toBe("kaws-companions")
      expect(firstCall[1].featuredArtworks.length).toBe(3)
      expect(firstCall[1].featuredArtworks[0].id).toBe(
        "ellsworth-kelly-black-ripe"
      )
      expect(firstCall[1].featuredArtworks[0].image.aspectRatio).toBe(1)
      expect(firstCall[1].featuredArtworks[0].image.imageUrl).toBe(
        "https://d32dm0rphc51dk.cloudfront.net/J95rqjn5Gq8Y1HyyKKMj2g/:version.jpg"
      )
      expect(secondCall[0].slug).toBe("collectible-sculptures")
      expect(secondCall[1].featuredArtworks.length).toBe(3)
      expect(thirdCall[0].slug).toBe("jasper-johns-flags")
      expect(thirdCall[1].featuredArtworks.length).toBe(3)
    })

    it("Handles connection errors", async () => {
      createConnectionMock.mockResolvedValue({
        close: connectionCloseMock,
        isConnected: false,
      })
      try {
        await saveFeaturedArtworks()
        expect(connectionCloseMock).toBeCalled()
        expect(metaphysicsMock).not.toBeCalled()
      } catch (e) {
        expect(e.message).toBe("Could not connect to database")
      }
    })

    it("Handles save errors", async () => {
      repositoryMock.update.mockImplementationOnce(() => {
        throw new Error("Could not save")
      })
      try {
        await saveFeaturedArtworks()
        expect(connectionCloseMock).toBeCalled()
      } catch (e) {
        expect(e.message).toBe("Could not save")
      }
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
      const newArtworks = sanitizeArtworkArray(ArtworksFixture)
      expect(newArtworks[0].image.aspectRatio).toBe(1)
      expect(newArtworks[0].image.aspect_ratio).toBeFalsy()
    })

    it("Handles empty aspect_ratio", () => {
      const newArtworks = sanitizeArtworkArray(ArtworksFixture)
      expect(newArtworks[1].image.aspectRatio).toBeFalsy()
      expect(newArtworks[1].image.aspect_ratio).toBeFalsy()
    })

    it("renames image_url to imageUrl", () => {
      const newArtworks = sanitizeArtworkArray(ArtworksFixture)
      expect(newArtworks[0].image.imageUrl).toMatch(
        "https://d32dm0rphc51dk.cloudfront.net/J95rqjn5Gq8Y1HyyKKMj2g/:version.jpg"
      )
    })

    it("Handles empty image_url", () => {
      const artwork = ArtworksFixture[0]
      delete artwork.image.image_url
      const newArtworks = sanitizeArtworkArray([artwork])
      expect(newArtworks[0].image.imageUrl).toBeFalsy()
      expect(newArtworks[0].image.image_url).toBeFalsy()
    })
  })

  describe("#mapQueryToString", () => {
    it("converts a query to a string for graphql", () => {
      const query = {
        aggregations: [],
        artist_ids: ["4d8b92934eb68a1b2c00025a"],
        gene_ids: ["paper-cut-outs"],
        keyword: "shard, shards",
      }
      expect(mapQueryToString(query)).toBe(
        'artist_ids: ["4d8b92934eb68a1b2c00025a"], gene_ids: ["paper-cut-outs"], keyword: "shard, shards"'
      )
    })

    it("correctly formats arrays", () => {
      const query = {
        aggregations: [],
        artist_ids: ["4d8b92934eb68a1b2c00025a", "561449627261691dc1000084"],
        gene_ids: ["paper-cut-outs", "polka-dots"],
        keyword: "shard, shards",
      }

      expect(mapQueryToString(query)).toBe(
        'artist_ids: ["4d8b92934eb68a1b2c00025a","561449627261691dc1000084"], gene_ids: ["paper-cut-outs","polka-dots"], keyword: "shard, shards"'
      )
    })
  })
})
