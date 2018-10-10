import slugify from "slugify"
import { Connection, createConnection, getMongoRepository } from "typeorm"
import { Collection, entities } from "../Entities"

const data = require("../../fixtures/collections.json")

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

    const repository = getMongoRepository(Collection)
    const collections = await repository.create(data as any)

    await repository.save(collections)
  } catch (err) {
    // tslint:disable-next-line
    console.error(err)
  }
}

bootstrap()
