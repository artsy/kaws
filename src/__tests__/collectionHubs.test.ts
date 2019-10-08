import { graphql } from "graphql"
import { Connection, createConnection } from "typeorm"
import { databaseConfig } from "../config/database"
import { Collection } from "../Entities"
import { createSchema } from "../utils/createSchema"

jest.unmock("typeorm")

const hub_slugs = [
  "contemporary",
  "post-war",
  "impressionist-and-modern",
  "pre-20th-century",
  "photography",
  "street-art",
]

const init = async () => {
  try {
    const connectionArgs = databaseConfig()
    const connection: Connection = await createConnection(connectionArgs)
    return connection
  } catch (error) {
    console.error("[kaws] Error to connecting to MongoDB:", error)
  }
}

const generateMockData = () => {
  return hub_slugs.map(slug => {
    return {
      title: "Pablo Picasso: Portraits",
      slug,
      category: "Modern",
      description:
        '<p>Although Pablo Picasso worked in a variety of different styles and mediums throughout his prolific career, he never stopped creating portraits of those in his inner circle. Even in his most abstract portraits, Picasso captures his sitters’ personalities. For example, his cubist portrait of his friend and art dealer <i><a href="https://www.artsy.net/artwork/pablo-picasso-portrait-of-art-dealer-ambroise-vollard-1867-1939">Ambroise Vollard</a></i> (1910), shows the figure broken down into geometric, angled shapes, although the viewer can still discover that Vollard was a serious and somewhat gruff individual with his downcast eyes and frown. Picasso is also famous for his portraits of his lovers, which often distort their features into playful abstractions. His sultry sleeping portrait of Marie-Thérèse Walter, <i>Le Rêve</i> (1932) is among the world’s most expensive paintings ever sold, reaching $155 million through a private sale in 2013. Regarding his outlook on portraiture, Picasso was often elusive. “When you start with a portrait and search for a pure form, a clear volume, through successive eliminations, you arrive inevitably at the egg,” he once said, “Likewise, starting with the egg and following the same process in reverse, one finishes with the portrait.”</p>',
      headerImage: "http://files.artsy.net/images/picasso-portraits.png",
      credit:
        "<p>&copy; Pablo Picasso / Artist Rights Society (ARS), New York, NY.</p>",
      query: {
        artist_ids: ["4d8b928b4eb68a1b2c0001f2"],
        gene_ids: ["portrait"],
        tag_id: "",
        keyword: "",
      },
    }
  })
}

describe("CollectionHubs", () => {
  // 1. populate test database with five collectionHubs
  // 2. create a graphQL query to request `collectionHubs()`
  // 3. assert that our five mocks are what gets returned.

  let connection
  let collectionRepository

  beforeAll(async () => {
    connection = await init()
  })
  beforeEach(async () => {
    try {
      collectionRepository = await connection.getMongoRepository(Collection)
      await collectionRepository.clear()
    } catch (e) {
      // This will fail the first time it runs because there's nothing to clear.
      // it's no big.
    }

    try {
      const mockData = generateMockData()
      await collectionRepository.insertMany(mockData)
    } catch (e) {
      console.error(
        "There was a problem inserting the initial data:",
        e.message
      )
      console.dir(e)
    }
  })
  afterAll(async () => {
    await connection.close()
  })

  it("returns a list of collectionHub instances where the slug is equal to one of the selected hub slugs.", async () => {
    const foundCollections = await collectionRepository.find()
    hub_slugs.forEach(root_slug => {
      expect(
        foundCollections.map(({ slug }) => slug).indexOf(root_slug)
      ).not.toBe(-1)
    })
  })

  it("respects graphql top-level query", async () => {
    const query = `
      query {
        hubCollections {
          slug
        }
      }
    `
    const schema = await createSchema()
    const result = await graphql(schema, query)
    const hubCollections = result!.data!.hubCollections
    expect(hubCollections.length).toBe(6)
    hubCollections!.forEach(hub => expect(hub_slugs).toContain(hub.slug))
  })
})
