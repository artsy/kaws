import { filter, isEmpty } from "lodash"
import { Arg, FieldResolver, Int, Query, Resolver, Root } from "type-graphql"
import { getMongoRepository } from "typeorm"
import { CollectionGroup } from "../Entities"
import { Collection } from "../Entities/Collection"
import { CollectionCategory } from "../Entities/CollectionCategory"

@Resolver(of => Collection)
export class CollectionsResolver {
  protected readonly repository = getMongoRepository(Collection)

  @Query(returns => [Collection])
  async collections(
    @Arg("artistID", { nullable: true }) artistID: string,
    @Arg("showOnEditorial", { nullable: true }) showOnEditorial: boolean,
    @Arg("isFeaturedArtistContent", { nullable: true })
    isFeaturedArtistContent: boolean,
    @Arg("size", () => Int, { nullable: true }) size: number,
    @Arg("randomizationSeed", { nullable: true }) randomizationSeed: string,
    @Arg("category", { nullable: true }) category: string
  ): Promise<Collection[]> {
    const hasArguments =
      [].filter.call(arguments, arg => arg !== undefined).length > 0
    const query: any = hasArguments ? { where: {} } : {}

    if (isFeaturedArtistContent !== undefined) {
      query.where.is_featured_artist_content = isFeaturedArtistContent
    }
    if (showOnEditorial !== undefined) {
      query.where.show_on_editorial = showOnEditorial
    }
    if (artistID) {
      query.where["query.artist_ids"] = { $in: [artistID] }
    }
    if (!randomizationSeed && size) {
      query.take = size
    }

    if (category !== undefined) {
      query.where.category = { $in: [category] }
    }

    if (randomizationSeed) {
      const aggregatePipeline: any = []
      if (!isEmpty(query.where)) {
        aggregatePipeline.push({ $match: query.where })
      }
      const randomizeBy = size ? size : 4
      aggregatePipeline.push({ $sample: { size: randomizeBy } })

      const data = await this.repository.aggregate(aggregatePipeline).toArray()

      data.forEach(item => (item.id = item._id))

      return data
    } else {
      const data = await this.repository.find(query)
      return data
    }
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
    return await this.repository.findOneOrFail({ slug })
  }

  @Query(returns => [Collection])
  async hubCollections() {
    const hubslugs = [
      "contemporary",
      "post-war",
      "impressionist-and-modern",
      "pre-20th-century",
      "photography",
      "street-art",
    ]

    return await hubslugs.map(async slug => await this.collection(slug))
  }

  @FieldResolver(type => [Collection])
  async relatedCollections(
    @Arg("size", () => Int, { defaultValue: 10 }) size: number,
    @Root() collection: Collection
  ): Promise<Collection[]> {
    const isArtistBased =
      collection.query.artist_ids && collection.query.artist_ids.length > 0

    if (isArtistBased) {
      const artistResults = await this.repository.find({
        where: {
          slug: { $ne: collection.slug },
          "query.artist_ids": { $in: collection.query.artist_ids },
        },
        take: size,
      })

      // We only want to return relatedArtistCollections when there are more
      // than 4. Otherwise we return category based related collections.
      if (artistResults.length > 4) {
        return artistResults
      }
    }

    const relatedCategoryResults = await this.repository.find({
      where: {
        slug: { $ne: collection.slug },
        category: collection.category,
        show_on_editorial: true,
      },
      take: size,
    })

    return relatedCategoryResults
  }

  @FieldResolver(type => Boolean)
  isDepartment(@Root() collection: Collection) {
    const linkedCollectionsWithMembers = filter(
      collection.linkedCollections,
      linkedCollection => {
        const membersLength =
          linkedCollection.members && linkedCollection.members.length
        return membersLength > 0
      }
    )
    return linkedCollectionsWithMembers.length > 0
  }

  @FieldResolver(type => [CollectionGroup])
  async linkedCollections(
    @Root() collection: Collection
  ): Promise<CollectionGroup[]> {
    const groups = await collection.linkedCollections.map(
      async linkedCollection => {
        return {
          ...linkedCollection,
          members: await this.repository.find({
            where: { slug: { $in: linkedCollection.members } },
          }),
        } as CollectionGroup
      }
    )

    return await Promise.all(groups)
  }
}
