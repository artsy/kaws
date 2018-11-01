import { Arg, Query, Resolver } from "type-graphql"
import { getMongoRepository } from "typeorm"
import { Collection } from "../Entities/Collection"

@Resolver(of => Collection)
export class CollectionsResolver {
  protected readonly repository = getMongoRepository(Collection)

  // TODO: should return a connection
  @Query(returns => [Collection])
  async collections(): Promise<Collection[]> {
    return await this.repository.find()
  }

  @Query(returns => Collection, { nullable: true })
  async collection(@Arg("slug") slug: string): Promise<Collection | undefined> {
    return await this.repository.findOne({ slug })
  }

  // @Mutation(type => Collection)
  // async createCollection(@Arg("collectionInput") collectionInput: AddCollectionInput): Promise<Collection> {
  //   const collection = this.repository.create(collectionInput)

  //   // TODO: validate input

  //   return await this.repository.save(collection)
  // }
}
