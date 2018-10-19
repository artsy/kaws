import "dotenv/config"

import { parse } from "mongodb-uri"
import { createConnection, getMongoRepository } from "typeorm"
import { Collection, entities } from "../src/Entities"

const data = require("../fixtures/collections.json")
const { MONGOHQ_URL } = process.env

bootstrap()

async function bootstrap() {
  try {
    const { username, password, database, hosts, options } = parse(MONGOHQ_URL!)

    await createConnection({
      type: "mongodb",
      username,
      password,
      database,
      ...options,
      host: hosts.map(a => a.host).join(","),
      port: 27017,
      ssl: true,
      entities,
    })

    const repository = getMongoRepository(Collection)
    const collections = await repository.create(data as any)

    await repository.save(collections)
  } catch (error) {
    // tslint:disable-next-line
    console.error("[kaws] Error bootstrapping data:", error)
  }
}
