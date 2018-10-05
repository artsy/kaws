import { Field, ID, Int, ObjectType } from "type-graphql"

@ObjectType()
export class CollectionQuery {
  @Field({ description: "" })
  acquireable: boolean

  @Field(type => [String], { description: "" })
  aggregations: string[]

  @Field(type => [String], { description: "" })
  artist_ids: string[]

  @Field({ description: "" })
  artist_id: string

  @Field()
  at_auction: boolean

  @Field()
  color: string

  @Field()
  dimension_range: string

  @Field(type => [String])
  extra_aggregation_gene_ids: string[]

  @Field()
  include_artworks_by_followed_artists: boolean

  @Field()
  include_medium_filter_in_aggregation: boolean

  @Field()
  inquireable_only: boolean

  @Field()
  for_sale: boolean

  @Field()
  gene_id: string

  @Field(type => [String])
  gene_ids: string[]

  @Field()
  height: string

  @Field()
  width: string

  @Field()
  medium: string

  @Field()
  period: string

  @Field(type => [String])
  periods: [string]

  @Field(type => [String])
  major_periods: [string]

  @Field(type => ID)
  partner_id: string

  @Field(type => [String])
  partner_cities: [string]

  @Field()
  price_range: string

  @Field(type => Int)
  page: number

  @Field(type => ID)
  sale_id: string

  @Field(type => Int)
  size: number

  @Field()
  sort: string

  @Field()
  tag_id: string

  @Field()
  keyword: string
}
