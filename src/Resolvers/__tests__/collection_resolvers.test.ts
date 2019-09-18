import { buildSchema } from "type-graphql"
import { getMongoRepository } from "typeorm"
import { Collection } from "../../Entities"
import { runQuery } from "../../test/utils"
import { CollectionsResolver } from "../Collections"
import { mockCollectionRepository } from "./fixtures/data"

const mockedGetMongoRepository = getMongoRepository as jest.Mock
const find = jest.fn(() =>
  Promise.resolve(mockCollectionRepository)
) as jest.Mock

const mockAggregate = jest.fn(() => ({
  toArray: () =>
    new Promise(resolve => {
      resolve(mockCollectionRepository)
    }),
}))

beforeEach(() => {
  mockedGetMongoRepository.mockReturnValue({
    aggregate: mockAggregate,
    find,
    findOneOrFail: ({ slug }) =>
      mockCollectionRepository.find(
        (collection: Collection) => collection.slug === slug
      ),
    distinct: _key => {
      return ["Collectible Sculptures"]
    },
  })
})

afterEach(() => {
  mockedGetMongoRepository.mockClear()
  find.mockClear()
})

async function createMockSchema() {
  const schema = await buildSchema({
    resolvers: [CollectionsResolver],
  })
  return schema
}

describe("Collections", () => {
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
          price_guidance
          show_on_editorial
          is_featured_artist_content
        }
      }
    `

    return runQuery(query, {}, createMockSchema).then(data => {
      expect((data as any).collections.length).toBe(3)
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
            price_guidance: null,
            show_on_editorial: false,
            is_featured_artist_content: true,
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
            price_guidance: 1000,
            show_on_editorial: true,
            is_featured_artist_content: false,
          },
          {
            id: "3",
            title: "Jasper Johns: Flags",
            description:
              '<p>In 1954, two years after being discharged from the United States Army, the 24-year-old <a href="https://www.artsy.net/artist/jasper-johns">Jasper Johns</a> had a vivid dream of the American flag.</p>',
            slug: "jasper-johns-flags",
            query: {
              id: null,
              tag_id: null,
            },
            price_guidance: 1000,
            show_on_editorial: false,
            is_featured_artist_content: true,
          },
        ],
      })
    })
  })

  describe("queries", () => {
    it("can construct queries with isFeaturedArtistContent", () => {
      const query = `
        {
          collections(isFeaturedArtistContent: true) {
            id
          }
        }
      `

      return runQuery(query, {}, createMockSchema).then(data => {
        expect(find).toBeCalledWith({
          where: { is_featured_artist_content: true },
        })
        expect((data as any).collections.length).toBeTruthy()
      })
    })

    it("can construct queries with showOnEditorial", () => {
      const query = `
        {
          collections(showOnEditorial: true) {
            id
          }
        }
      `

      return runQuery(query, {}, createMockSchema).then(data => {
        expect(find).toBeCalledWith({ where: { show_on_editorial: true } })
        expect((data as any).collections.length).toBeTruthy()
      })
    })

    it("can construct queries with artistID", () => {
      const query = `
        {
          collections(artistID: "123") {
            id
          }
        }
      `

      return runQuery(query, {}, createMockSchema).then(data => {
        expect(find).toBeCalledWith({
          where: { "query.artist_ids": { $in: ["123"] } },
        })
        expect((data as any).collections.length).toBeTruthy()
      })
    })

    it("can construct queries with multiple args", () => {
      const query = `
        {
          collections(showOnEditorial: true, artistID: "123") {
            id
          }
        }
      `

      return runQuery(query, {}, createMockSchema).then(data => {
        expect(find).toBeCalledWith({
          where: {
            show_on_editorial: true,
            "query.artist_ids": { $in: ["123"] },
          },
        })
        expect((data as any).collections.length).toBeTruthy()
      })
    })

    it("can restrict via size", () => {
      const query = `
        {
          collections(size: 1) {
            id
          }
        }
      `

      return runQuery(query, {}, createMockSchema).then(data => {
        expect(find).toBeCalledWith({
          take: 1,
          where: {},
        })
        expect((data as any).collections.length).toBeTruthy()
      })
    })

    it("can return collections in random order via randomize", () => {
      const query = `
        {
          collections(randomizationSeed: "123") {
            id
          }
        }
      `

      return runQuery(query, {}, createMockSchema).then(data => {
        expect(mockAggregate).toBeCalledWith([{ $sample: { size: 4 } }])
      })
    })
  })

  it("can return collections in random order via randomize with query", () => {
    const query = `
      {
        collections(randomizationSeed: "1234", size: 2, showOnEditorial: true) {
          id
        }
      }
    `

    return runQuery(query, {}, createMockSchema).then(data => {
      expect(mockAggregate).toBeCalledWith([
        { $match: { show_on_editorial: true } },
        { $sample: { size: 2 } },
      ])
    })
  })

  it("can filter collections by category", () => {
    const query = `
      {
        collections(category: "Pop Art") {
          id
        }
      }
    `

    return runQuery(query, {}, createMockSchema).then(data => {
      expect(find).toBeCalledWith({
        where: {
          category: { $in: ["Pop Art"] },
        },
      })
    })
  })
})

describe("Categories", () => {
  it("returns collections grouped by category name", () => {
    const query = `
      {
        categories {
          name
          collections {
            title
          }
        }
      }
    `
    return runQuery(query, {}, createMockSchema).then(data => {
      expect(data).toEqual({
        categories: [
          {
            name: "Collectible Sculptures",
            collections: [
              { title: "KAWS: Companions" },
              { title: "Big Artists, Small Sculptures" },
              { title: "Jasper Johns: Flags" },
            ],
          },
        ],
      })
    })
  })
})

describe("Collection", () => {
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
  it("returns related artist collections", () => {
    const query = `
      {
        collection(slug: "kaws-companions") {
          id
          title
          slug
          category
          query {
            id
            artist_ids
          }
          relatedCollections {
            id
            slug
            title
          }
        }
      }
    `

    return runQuery(query, {}, createMockSchema).then(data => {
      expect(find).toBeCalledWith({
        where: {
          "query.artist_ids": { $in: ["123"] },
        },
      })
    })
  })

  it("returns related category collections", () => {
    const query = `
      {
        collection(slug: "jasper-johns-flags") {
          id
          title
          slug
          category
          query {
            id
            artist_ids
          }
          relatedCollections {
            id
            slug
            title
          }
        }
      }
    `

    return runQuery(query, {}, createMockSchema).then(data => {
      expect(find).toBeCalledWith({
        where: {
          category: { $in: ["Pop Art"] },
          show_on_editorial: true,
        },
      })
    })
  })
})
