import { Arg, Query, Resolver } from "type-graphql"
import { getMongoRepository } from "typeorm"
import { Collection } from "../Entities/Collection"
import { CollectionCategory } from "../Entities/CollectionCategory"

@Resolver(of => Collection)
export class CollectionsResolver {
  protected readonly repository = getMongoRepository(Collection)

  @Query(returns => [Collection])
  async collections(
    @Arg("artistID", { nullable: true }) artistID: string,
    @Arg("showOnEditorial", { nullable: true }) showOnEditorial: boolean
  ): Promise<Collection[]> {
    if (showOnEditorial !== undefined) {
      return await this.repository.find({
        where: {
          // show_on_editorial: showOnEditorial,
          "query.artist_ids": { $in: ["5c5b1fa7e754a9d2d390c119"] },
        },
      } as any)
    } else {
      return await this.repository.find()
    }
  }

  // TODO: should return a connection
  // @Query(returns => [Collection])
  // async collections(
  //   @Arg("artistID", { nullable: true }) artistID: string,
  //   @Arg("showOnEditorial", { nullable: true }) showOnEditorial: boolean
  // ): Promise<Collection[]> {
  //   const query: any = {}
  //   const hasArguments =
  //     [].filter.call(arguments, a => a !== undefined).length > 0

  //   if (hasArguments) {
  //     // query.where = []
  //     if (artistID) {
  //       query.where.push({ "query.artist_ids": { $in: [artistID] } })
  //       // return await this.repository.find({
  //       //   where: { "query.artist_ids": { $in: [artistID] } },
  //       // })
  //     }
  //     if (showOnEditorial !== undefined) {
  //       query.show_on_editoral = showOnEditorial
  //       // query.where.push({ show_on_editoral: showOnEditorial })
  //       console.log("query", query)
  //     }
  //   }
  //   const result = await this.repository.find(query)
  //   console.log("RESULT", result)

  //   return result
  // }

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
