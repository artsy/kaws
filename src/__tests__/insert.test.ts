import { Connection, createConnection } from "typeorm"
import { databaseConfig } from "../config/database"
import { Collection } from "../Entities"

const init = async () => {
  try {
    const connectionArgs = databaseConfig()
    const connection: Connection = await createConnection(connectionArgs)
    return connection
  } catch (error) {
    console.error("[kaws] Error to connecting to MongoDB:", error)
  }
}

describe("CRUD operations work", () => {
  let connection
  beforeAll(async () => {
    connection = await init()
  })
  beforeEach(async () => {
    try {
      await connection.getRepository(Collection).clear()
    } catch (e) {
      // This will fail the first time it runs because there's nothing to clear.
      // it's no big.
    }
  })
  afterAll(async () => {
    await connection.close()
  })
  it("can retrieve a saved entity", async () => {
    const collectionRepository = connection.getRepository(Collection)

    const testCollection = {
      title: "KAWS: Toys",
      slug: "kaws-toys",
      category: "Collectible Sculptures",
      description:
        '<p>Brian Donnelly, the ex-Disney illustrator better known as KAWS, created his first vinyl toy in 1999: an eight-inch “<a href="https://www.artsy.net/collection/kaws-companions">Companion</a>” whose round belly, noodly limbs, and white gloves immediately reminded viewers of the cartoons made famous by his former workplace. The limited edition toy, produced in collaboration with the Japanese brand Bounty Hunter, reflected KAWS’s desire to make his work more accessible to the public. In the years since, KAWS has rendered most of his signature characters in three dimensions, including Chum, Bendy, and Blitz, as well as his renditions of iconic cartoons like Tweety, <a href="https://www.artsy.net/collection/kaws-snoopy">Snoopy</a>, and <a href="https://www.artsy.net/collection//kaws-pinocchio">Pinocchio</a>. When first released, these sculptures often sell out in just seconds. When the Museum of Modern Art promoted KAWS’s toys in its design store, collector demand was so high that the museum’s website crashed multiple times.</p>',
      headerImage:
        "https://artsy-vanity-files-production.s3.amazonaws.com/images/kaws2.png",
      credit: "<p>&copy; KAWS, Medicom Toy 2007.</p>",
      query: {
        artist_ids: ["4e934002e340fa0001005336"],
        gene_ids: ["sculpture", "related-to-toys"],
        tag_id: "",
        keyword:
          "Companion, BFF, Passing Through, Astroboy, Astro Boy, Small Lie, Together, Accomplice, Twins, Stormtrooper, Boba Fett, Darth Vader, Undercover Bear, Tweety, Pinocchio, Resting Place, Along the Way, Final Days, Zooth, Tweety, Joe Kaws, Snoopy, Seeing Watching, Pinocchio, Jiminy Cricket, Partners, Milo, Kubrick, Zooth, Bounty Hunter, Bearbrick, Chum, JPP, Final Days, Chompers, Cat Teeth Bank, Bend, Blitz, Bendy, Accomplice",
      },
    } as Collection

    const savedCollection = await collectionRepository.save(testCollection)
    const readCollection = await collectionRepository.findOne({
      _id: savedCollection.id,
    })

    expect(readCollection.slug).toBe(testCollection.slug)
  })
})
