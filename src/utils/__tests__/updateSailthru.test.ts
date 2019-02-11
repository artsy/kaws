jest.mock("../../Entities", () => ({ Collection: jest.fn() }))
jest.mock("../../config/database", () => ({ databaseConfig: jest.fn() }))
const pushContent = jest.fn()

jest.mock("../getArtists", () => ({ getArtists: jest.fn() }))
jest.mock("../getArtworks", () => ({ getArtworks: jest.fn() }))

jest.mock("sailthru-client", () => ({
  createSailthruClient: jest.fn().mockReturnValue({
    pushContent,
  }),
}))
jest.mock("typeorm", () => {
  return {
    Connection: jest.fn(),
    createConnection: jest.fn(),
    getMongoRepository: jest.fn(),
  }
})

import { createConnection, getMongoRepository } from "typeorm"
import { pushContentToSailthru } from "../updateSailthru"

const createConnectionMock = createConnection as jest.Mock<any>
const getMongoRepositoryMock = getMongoRepository as jest.Mock<any>

describe("pushContentToSailthru", () => {
  let repositoryMock

  beforeEach(() => {
    repositoryMock = { find: jest.fn() }
    getMongoRepositoryMock.mockReturnValue(repositoryMock)
    createConnectionMock.mockResolvedValue({
      close: jest.fn(),
      isConnected: true,
    })
  })

  it("sends collections to Sailthru", async () => {
    repositoryMock.find.mockResolvedValue([
      {
        slug: "cat-pictures",
        category: "Contemporary",
        title: "Cat Pictures",
        headerImage: "http://placekitten.com/400/400",
        description: "Wow! Look at those cats!",
      },
      {
        slug: "dog-pictures",
        category: "Abstract",
        title: "Dog Pictures",
        headerImage:
          "https://images.pexels.com/photos/356378/pexels-photo-356378.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        description: "I mean if you like dogs that's cool too I guess",
      },
    ])

    await pushContentToSailthru()

    const argumentsForPushToSailthru = pushContent.mock.calls[0]

    // 0th argument: name
    expect(argumentsForPushToSailthru[0]).toEqual("Cat Pictures")
    // 1st argument: full url
    expect(argumentsForPushToSailthru[1]).toEqual(
      "https://www.artsy.net/collection/cat-pictures"
    )
    // 2nd argument: tags, vars, and images being passed to Sailthru
    expect(argumentsForPushToSailthru[2].tags[0]).toEqual("collection")
    expect(argumentsForPushToSailthru[2].vars).toEqual({
      slug: "cat-pictures",
      collection_category: "Contemporary",
      description: "Wow! Look at those cats!",
    })
    expect(argumentsForPushToSailthru[2].images.full).toEqual({
      url: "http://placekitten.com/400/400",
    })
  })
})
