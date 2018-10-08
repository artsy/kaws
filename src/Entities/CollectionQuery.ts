import { Field, ID, Int, ObjectType } from "type-graphql"
import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm"
@ObjectType()
@Entity()
export class CollectionQuery {
  @Field(type => ID)
  @ObjectIdColumn()
  id: ObjectID

  @Field({ description: "" })
  @Column()
  acquireable: boolean

  @Field(type => [String], { description: "" })
  @Column()
  aggregations: string[]

  @Field(type => [String], { description: "" })
  @Column()
  artist_ids: string[]

  @Field({ description: "" })
  @Column()
  artist_id: string

  @Field()
  @Column()
  at_auction: boolean

  @Field()
  @Column()
  color: string

  @Field()
  @Column()
  dimension_range: string

  @Field(type => [String])
  @Column()
  extra_aggregation_gene_ids: string[]

  @Field()
  @Column()
  include_artworks_by_followed_artists: boolean

  @Field()
  @Column()
  include_medium_filter_in_aggregation: boolean

  @Field()
  @Column()
  inquireable_only: boolean

  @Field()
  @Column()
  for_sale: boolean

  @Field()
  @Column()
  gene_id: string

  @Field(type => [String])
  @Column()
  gene_ids: string[]

  @Field()
  @Column()
  height: string

  @Field()
  @Column()
  width: string

  @Field()
  @Column()
  medium: string

  @Field()
  @Column()
  period: string

  @Field(type => [String])
  @Column()
  periods: [string]

  @Field(type => [String])
  @Column()
  major_periods: [string]

  @Field(type => ID)
  @Column()
  partner_id: string

  @Field(type => [String])
  @Column()
  partner_cities: [string]

  @Field()
  @Column()
  price_range: string

  @Field(type => Int)
  @Column()
  page: number

  @Field(type => ID)
  @Column()
  sale_id: string

  @Field(type => Int)
  @Column()
  size: number

  @Field()
  @Column()
  sort: string

  @Field()
  @Column()
  tag_id: string

  @Field()
  @Column()
  keyword: string
}
