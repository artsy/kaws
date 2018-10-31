import { buildSchema } from "type-graphql"
import { getMongoRepository } from "typeorm"
import { Collection } from "../../Entities"
import { runQuery } from "../../test/utils"
import { CollectionsResolver } from "../Collections"
import { mockCollectionRepository } from "./fixtures/data"

const mockedGetMongoRepository = getMongoRepository as jest.Mock

beforeEach(() => {
  mockedGetMongoRepository.mockReturnValue({
    find: () => mockCollectionRepository,
    findOne: ({ slug }) =>
      mockCollectionRepository.find(
        (collection: Collection) => collection.slug === slug
      ),
  })
})

afterEach(() => {
  mockedGetMongoRepository.mockClear()
})

async function createMockSchema() {
  const schema = await buildSchema({
    resolvers: [CollectionsResolver],
  })
  return schema
}

describe("Collection", () => {
  it("returns the collections", () => {
    const query = `
      {
        collections {
          id
          title
          description
          slug
          query {
            id
            tag_id
          }
        }
      }
    `

    return runQuery(query, {}, createMockSchema).then(data => {
      expect((data as any).collections.length).toBe(2)
      expect(mockedGetMongoRepository).toBeCalled()
      expect(data).toEqual({
        collections: [
          {
            id: "1",
            title: "KAWS: Companions",
            description:
              "<p>Brian Donnelly, better known as KAWS, spent the first year of his career as an animator for Disney.</p>",
            slug: "kaws-companions",
            query: {
              id: null,
              tag_id: "companion",
            },
          },
          {
            id: "2",
            title: "Big Artists, Small Sculptures",
            description:
              "<p>Today&rsquo;s collectible sculptures&mdash;from KAWS&rsquo;s cartoon Companions to Yayoi Kusama&rsquo;s miniature pumpkins&mdash;have roots in the 1980s New York art scene.</p>",
            slug: "collectible-sculptures",
            query: {
              id: null,
              tag_id: null,
            },
          },
        ],
      })
    })
  })

  it("returns finds collection by slug", () => {
    const query = `
      {
        collection(slug: "kaws-companions") {
          id
          title
          description
          slug
          query {
            id
            tag_id
          }
        }
      }
    `

    return runQuery(query, {}, createMockSchema).then(data => {
      expect(data).toEqual({
        collection: {
          id: "1",
          title: "KAWS: Companions",
          description:
            "<p>Brian Donnelly, better known as KAWS, spent the first year of his career as an animator for Disney.</p>",
          slug: "kaws-companions",
          query: {
            id: null,
            tag_id: "companion",
          },
        },
      })
    })
  })
})
