import { Arg, Query, Resolver } from "type-graphql"
import { getMongoRepository } from "typeorm"
import { Collection } from "../Entities/Collection"
import { CollectionCategory } from "../Entities/CollectionCategory"

@Resolver(of => Collection)
export class CollectionsResolver {
  protected readonly repository = getMongoRepository(Collection)

  // TODO: should return a connection
  @Query(returns => [Collection])
  async collections(): Promise<Collection[]> {
    return await this.repository.find()
  }

  // TODO: should return a connection
  @Query(returns => [CollectionCategory])
  async categories(): Promise<CollectionCategory[]> {
    const data = await this.repository.group(
      { category: 1 },
      { category: { $exists: true } },
      {},
      (curr, result) => {
        if (!result.collections) {
          result.collections = [curr]
        } else {
          result.collections.push(curr)
        }
      },
      result => result,
      true
    )

    return data.map(({ category, collections }) => ({
      name: category,
      collections,
    }))
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
