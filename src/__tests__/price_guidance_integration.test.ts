jest.mock("../utils/getPriceGuidance")
import { getPriceGuidance } from "../utils/getPriceGuidance"
;(getPriceGuidance as any).mockResolvedValue(1000)

import { Connection, createConnection, MongoRepository } from "typeorm"
import { databaseConfig } from "../config/database"
import { Collection } from "../Entities"
import { updateDatabase } from "../utils/updateDatabase"

const hub_slugs = [
  "contemporary",
  "post-war",
  "impressionist-and-modern",
  "pre-20th-century",
  "photography",
  "street-art",
]
const PGs = [100, 100, 100, 100, 200, null]
const generateMockData = () => {
  return hub_slugs.map((slug, index) => {
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
      price_guidance: PGs[index],
    }
  })
}

describe("priceGuidance", () => {
  let connection: Connection
  let repo: MongoRepository<Collection>
  let data: Collection[]
  let models: Collection[]

  const openDatabaseConnection = async () => {
    const connectionArgs = databaseConfig()
    return await createConnection(connectionArgs)
  }

  const getRepo = async activeConnection => {
    const repository = await activeConnection.getMongoRepository(Collection)
    try {
      await repository.clear()
    } catch (e) {
      // no worries if this fails, just means it's the first time it ran
    }

    return repository
  }

  const seedData = async () => {
    data = generateMockData() as Collection[]
    await updateDatabase(data)
    return data
  }

  beforeAll(async () => {
    connection = await openDatabaseConnection()
    repo = await getRepo(connection)
    data = await seedData()
    models = await repo.find()
  })

  afterAll(async () => {
    try {
      await connection.close()
    } catch (e) {
      console.warn(e.message)
    }
  })

  it("respects manually specified price guidance values", () => {
    hub_slugs.forEach((_item, index) => {
      const model = models[index]
      const expected_value = PGs[index] || 1000
      expect(model.priceGuidance).toBe(expected_value)
    })
  })

  it("automatically looks up and tries to populate price guidance on those records where it was null", () => {
    // it didn't try to set price guidance on 1-5, which specified overrides
    expect(getPriceGuidance).not.toHaveBeenCalledWith(models[0].slug)
    expect(getPriceGuidance).not.toHaveBeenCalledWith(models[1].slug)
    expect(getPriceGuidance).not.toHaveBeenCalledWith(models[2].slug)
    expect(getPriceGuidance).not.toHaveBeenCalledWith(models[3].slug)
    expect(getPriceGuidance).not.toHaveBeenCalledWith(models[4].slug)

    // record 6 had a null price guidance, so this was invoked.
    expect(getPriceGuidance).toHaveBeenCalledWith(models[5].slug)
  })

  it("changing an override value is reflected in the data", async () => {
    const update = { ...models[0], price_guidance: 20000 }
    await updateDatabase([update])
    const updated_models = await repo.find()
    expect(updated_models[0].priceGuidance).toBe(20000) // new override
  })

  it("erases price guidance override if input specifies `null`, falling back to generated value", async () => {
    const update = { ...models[0], price_guidance: null }
    await updateDatabase([update])
    const updated_models = await repo.find()
    expect(updated_models[0].priceGuidance).toBe(1000) // computed value
  })
})
