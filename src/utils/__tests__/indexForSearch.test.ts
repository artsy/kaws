jest.mock("../../Entities", () => ({ Collection: jest.fn() }))
jest.mock("../../config/database", () => ({ databaseConfig: jest.fn() }))
jest.mock("../../lib/search", () => ({
  search: {
    client: { index: jest.fn() },
    index: "marketing_collections_development",
  },
  algoliaSearch: {
    client: { initIndex: jest.fn() },
    index: { saveObject: jest.fn() },
  },
  algoliaSetSettings: jest.fn(),
}))
jest.mock("typeorm", () => {
  return {
    Connection: jest.fn(),
    createConnection: jest.fn(),
    getMongoRepository: jest.fn(),
  }
})
jest.mock("../../lib/metaphysics", () => ({
  metaphysics: jest.fn(),
}))

import { createConnection, getMongoRepository } from "typeorm"
import { metaphysics as MetaphysicsMock } from "../../lib/metaphysics"
import {
  search as SearchMock,
  algoliaSearch,
  algoliaSetSettings,
} from "../../lib/search"
import { indexForSearch } from "../indexForSearch"

const createConnectionMock = createConnection as jest.Mock<any>
const getMongoRepositoryMock = getMongoRepository as jest.Mock<any>
const SearchClientMock = SearchMock.client

describe("indexForSearch", () => {
  let repositoryMock
  let originalConsoleLog

  beforeEach(() => {
    repositoryMock = { find: jest.fn() }
    getMongoRepositoryMock.mockReturnValue(repositoryMock)
    createConnectionMock.mockResolvedValue({
      close: jest.fn(),
      isConnected: true,
    })
    ;(MetaphysicsMock as any).mockImplementation(() =>
      Promise.resolve({
        data: {
          marketingCollection: {
            artworks: { hits: [{ imageUrl: "/path/to/happy/cats.jpg" }] },
          },
        },
      })
    )
    originalConsoleLog = console.log
    console.log = jest.fn()
  })

  afterEach(() => {
    console.log = originalConsoleLog
  })

  it("indexes collections for search", async () => {
    repositoryMock.find.mockResolvedValue([
      {
        id: 1,
        name: "Cat Pictures",
        slug: "cat-pictures",
        category: "Contemporary",
        title: "Cat Pictures",
        query: {
          keyword: "Cats, Awesome, Art",
        },
      },
      {
        id: 2,
        name: "Dog Pictures",
        slug: "dog-pictures",
        category: "Abstract",
        title: "Dog Pictures",
        query: {
          keyword: "Dogs, Also Cool",
        },
      },
    ])

    await indexForSearch()

    const firstCollection = SearchClientMock.index.mock.calls[0][0]
    expect(firstCollection.index).toBe("marketing_collections_development")
    expect(firstCollection.type).toBe("marketing_collection")
    expect(firstCollection.id).toBe("1")
    expect(firstCollection.body.name).toBe("Cat Pictures")
    expect(firstCollection.body.featured_names).toBe("Contemporary")
    expect(firstCollection.body.alternate_names).toBe("Cats, Awesome, Art")
    expect(firstCollection.body.slug).toBe("cat-pictures")
    expect(firstCollection.body.visible_to_public).toBe(true)
    expect(firstCollection.body.search_boost).toBe(1000)
    expect(firstCollection.body.image_url).toBe("/path/to/happy/cats.jpg")
    const secondCollection = SearchClientMock.index.mock.calls[1][0]
    expect(secondCollection.index).toBe("marketing_collections_development")
    expect(secondCollection.type).toBe("marketing_collection")
    expect(secondCollection.id).toBe("2")
    expect(secondCollection.body.name).toBe("Dog Pictures")
    expect(secondCollection.body.featured_names).toBe("Abstract")
    expect(secondCollection.body.alternate_names).toBe("Dogs, Also Cool")
    expect(secondCollection.body.slug).toBe("dog-pictures")
    expect(secondCollection.body.visible_to_public).toBe(true)
    expect(secondCollection.body.search_boost).toBe(1000)
    expect(firstCollection.body.image_url).toBe("/path/to/happy/cats.jpg")

    expect(algoliaSetSettings).toHaveBeenCalledTimes(1)
    expect(algoliaSearch.index.saveObject).toHaveBeenCalledTimes(2)
  })
})
