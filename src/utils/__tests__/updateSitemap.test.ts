jest.mock("../../Entities", () => ({ Collection: jest.fn() }))
jest.mock("../../config/database", () => ({ databaseConfig: jest.fn() }))
jest.mock("aws-sdk", () => ({ S3: jest.fn() }))
jest.mock("typeorm", () => {
  return {
    Connection: jest.fn(),
    createConnection: jest.fn(),
    getMongoRepository: jest.fn(),
  }
})

import * as AWSMock from "aws-sdk"
import { createConnection, getMongoRepository } from "typeorm"
import { updateSitemap } from "../updateSitemap"

const createConnectionMock = createConnection as jest.Mock<any>
const getMongoRepositoryMock = getMongoRepository as jest.Mock<any>
const S3Mock = AWSMock.S3 as any // TS does not like `as jest.Mock<any>`

describe("updateSitemap", () => {
  let repositoryMock
  let uploadMock

  beforeEach(() => {
    repositoryMock = { find: jest.fn() }
    uploadMock = jest.fn()

    S3Mock.mockImplementation(() => ({ upload: uploadMock }))
    getMongoRepositoryMock.mockReturnValue(repositoryMock)
    createConnectionMock.mockResolvedValue({
      close: jest.fn(),
      isConnected: true,
    })
  })

  it("uploads sitemap JSON to S3", async () => {
    repositoryMock.find.mockResolvedValue([
      {
        slug: "kaws-companions",
      },
      {
        slug: "street-art-now",
      },
    ])

    await updateSitemap()

    const argumentsForUpload = uploadMock.mock.calls[0][0]

    expect(argumentsForUpload.Bucket).toEqual("artsy-data")
    expect(argumentsForUpload.ACL).toEqual("public-read")
    expect(argumentsForUpload.ContentType).toEqual("application/json")
    expect(argumentsForUpload.Key).toEqual(
      "collect/collect_and_collections.json"
    )

    expect(argumentsForUpload.Body).toContain("/collect")
    expect(argumentsForUpload.Body).toContain("/collections")
    expect(argumentsForUpload.Body).toContain("/collection/kaws-companions")
    expect(argumentsForUpload.Body).toContain("/collection/street-art-now")
  })
})
