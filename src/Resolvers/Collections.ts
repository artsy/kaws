import { Arg, Int, Query, Resolver } from "type-graphql"
import { getMongoRepository } from "typeorm"
import { Collection } from "../Entities/Collection"
import { CollectionCategory } from "../Entities/CollectionCategory"

@Resolver(of => Collection)
export class CollectionsResolver {
  protected readonly repository = getMongoRepository(Collection)

  @Query(returns => [Collection])
  async collections(
    @Arg("artistID", { nullable: true }) artistID: string,
    @Arg("showOnEditorial", { nullable: true }) showOnEditorial: boolean,
    @Arg("size", () => Int, { nullable: true }) size: number
  ): Promise<Collection[]> {
    const hasArguments =
      [].filter.call(arguments, arg => arg !== undefined).length > 0
    const query: any = hasArguments ? { where: {} } : {}

    if (showOnEditorial !== undefined) {
      query.where.show_on_editorial = showOnEditorial
    }
    if (artistID) {
      query.where["query.artist_ids"] = { $in: [artistID] }
    }
    if (size) {
      query.take = size
    }
    return await this.repository.find(query)
  }

  // TODO: should return a connection
  @Query(returns => [CollectionCategory])
  async categories(): Promise<CollectionCategory[]> {
    const categories = await this.repository.distinct("category", {
      category: { $ne: null },
    })
    return categories.map(category => ({
      name: category,
      collections: this.repository.find({ category }),
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
