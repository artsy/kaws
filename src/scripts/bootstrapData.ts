import slugify from "slugify"
import { Connection, createConnection, getMongoManager } from "typeorm"
import { Collection, CollectionQuery, entities, Image } from "../Entities"
import * as data from "../fixtures/CollectionsResolver.json"

async function bootstrap() {
  try {
    const connection: Connection = await createConnection({
      type: "mongodb",
      host: "localhost",
      port: 27017,
      database: "kaws",
      entities,
      synchronize: true,
    })

    const collection: Collection = new Collection()
    collection.title = "KAWS, Companions"
    collection.keywords = `Companion, BFF, Passing Through, Astroboy, Astro Boy, Small Lie,
    Together, Accomplice, Twins, Stormtrooper,
    Boba Fett, Darth Vader, Undercover Bear, Tweety, Pinocchio,
    Resting Place, Along the Way, Final Days`
    collection.description = `
  Brian Donnelly, better known as KAWS, spent the first year of his career as an animator for Disney.
  After leaving in 1997, KAWS took inspiration from the company’s signature cartoon, Mickey Mouse,
  to create his own set of characters that he named “Companions.” With gloved hands and X’s for eyes,
  “Companions” first appeared in KAWS’s graffiti works across New York City in the late 1990s.
  By the end of the decade, the street artist created his first three-dimensional version,
  and his characters have since taken on a variety of colors, sizes, and poses.
  In 2017, his four-foot-tall Seated Companion (2011) broke the auction record for the series,
  selling for over $400,000. However, many of KAWS’s “Companions” are considerably more affordable,
  such as his vinyl toys produced in collaboration with esteemed manufacturers including Bounty Hunter,
  Bape, Medicom, and his own brand OriginalFake, which was active between 2006 and 2013.
  `
    collection.slug = slugify(collection.title)
    collection.headerImage = new Image()
    collection.headerImage.small = collection.headerImage.medium = collection.headerImage.large =
      "https://cdn3.pitchfork.com/longform/239/kanyeart1865.jpg"

    collection.query = new CollectionQuery()
    collection.query.artist_ids = ["kaws"]

    const manager = await getMongoManager()
    await manager.save(collection)
  } catch (err) {
    // tslint:disable-next-line
    console.error(err)
  }
}

bootstrap()
