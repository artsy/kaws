import { Arg, Query, Resolver } from "type-graphql"
import { Collection } from "./CollectionType"
import { data } from "./Data"

@Resolver(of => Collection)
export class CollectionsResolver {
  private readonly items: Collection[] = data

  @Query(returns => [Collection])
  async collections(): Promise<Collection[]> {
    return await this.items
  }

  @Query(returns => Collection, { nullable: true })
  async collection(@Arg("slug") slug: string): Promise<Collection | undefined> {
    return await this.items.find(collection => collection.slug === slug)
  }
}
