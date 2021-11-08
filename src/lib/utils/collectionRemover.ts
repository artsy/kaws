import {
  Connection,
  createConnection,
  getMongoRepository,
  MongoRepository,
} from "typeorm"
import { Client as ElasticsearchClient } from "elasticsearch"
import { red, yellow, green } from "bash-color"

import { databaseConfig } from "../../config/database"
import { Collection } from "../../Entities/Collection"

export class CollectionRemover {
  private slugs: string[]
  private mongoConnection: Connection
  private mongoRepository: MongoRepository<Collection>
  private elasticsearchClient: ElasticsearchClient
  private elasticsearchIndexName: string = [
    process.env.ELASTICSEARCH_INDEX_NAME || "marketing_collections",
    process.env.NODE_ENV,
  ].join("_")

  constructor(collectionSlugs: string[]) {
    this.slugs = collectionSlugs
    this.checkEnvironment()
  }

  checkEnvironment = () => {
    const { MONGOHQ_URL, ELASTICSEARCH_URL } = process.env
    if (!MONGOHQ_URL) throw new Error("MONGOHQ_URL must be defined")
    if (!ELASTICSEARCH_URL) throw new Error("ELASTICSEARCH_URL must be defined")
  }

  setup = async () => {
    // setup Mongo
    this.mongoConnection = await createConnection(databaseConfig())
    if (this.mongoConnection.isConnected) {
      this.mongoRepository = getMongoRepository(Collection)
    }
    // setup Elasticsearch
    this.elasticsearchClient = new ElasticsearchClient({
      host: process.env.ELASTICSEARCH_URL,
      maxRetries: 2,
      keepAlive: true,
      maxSockets: 10,
    })
  }

  perform = async () => {
    await Promise.all(this.slugs.map((slug) => this.removeCollection(slug)))
  }

  removeCollection = async (slug: string) => {
    try {
      const collection = await this.mongoRepository.findOne({ slug })
      if (collection) {
        await this.removeFromSearchIndex(collection!)
        await this.removeFromDatabase(collection!)
        console.log(green(`Removed ${collection?.title}`))
      } else {
        console.log(red(`Could not find collection for ${slug}`))
      }
    } catch (e) {
      console.log(red(e.message))
      throw e
    }
  }

  removeFromSearchIndex = async (collection: Collection) => {
    try {
      await this.elasticsearchClient.delete({
        index: this.elasticsearchIndexName,
        type: "marketing_collection",
        id: collection.id.toString(),
      })
    } catch (e) {
      if (e.message === "Not Found") {
        console.log(yellow(`  ${collection.slug} Not found in search index`))
      } else {
        console.log(red(e.message))
        throw e
      }
    }
  }

  removeFromDatabase = async (collection: Collection) => {
    try {
      await this.mongoRepository.delete({ slug: collection.slug })
    } catch (e) {
      console.log(red(e.message))
      throw e
    }
  }

  teardown = () => {
    // teardown Mongo
    if (this.mongoConnection?.isConnected) {
      this.mongoConnection.close()
    }
    // teardown Elasticsearch
    this.elasticsearchClient.close()
  }
}
