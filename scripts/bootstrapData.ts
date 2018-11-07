import "dotenv/config"

import { Connection, createConnection, getMongoRepository } from "typeorm"
import { databaseConfig } from "../src/config/database"
import { Collection } from "../src/Entities"
const data = require("../fixtures/collections.json")

bootstrap()

async function bootstrap() {
  try {
    const connection: Connection = await createConnection(databaseConfig())
    if (connection.isConnected) {
      const repository = getMongoRepository(Collection)
      const collections = await repository.create(data as any)

      const isSaved = await repository.save(collections)
      if (isSaved) {
        // tslint:disable-next-line
        console.log("Successfully bootstrapped collections")
        connection.close()
      }
    }
  } catch (error) {
    // tslint:disable-next-line
    console.error("[kaws] Error bootstrapping data:", error)
  }
}
