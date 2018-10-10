import { Arg, Query, Resolver } from "type-graphql"
import { getMongoRepository } from "typeorm"
import { Collection } from "../Entities/Collection"

@Resolver(of => Collection)
export class CollectionsResolver {
  private readonly repository = getMongoRepository(Collection)

  @Query(returns => [Collection])
  async collections(): Promise<Collection[]> {
    return await this.repository.find()
  }

  @Query(returns => Collection, { nullable: true })
  async collection(@Arg("slug") slug: string): Promise<Collection | undefined> {
    return await this.repository.findOne({ slug })
  }
}
