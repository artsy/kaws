import { Field, ID, Int, ObjectType } from "type-graphql"
import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm"
@ObjectType()
@Entity()
export class CollectionQuery {
  @Field(type => ID)
  @ObjectIdColumn()
  id: ObjectID

  @Field({ nullable: true, description: "" })
  @Column({ nullable: true })
  acquireable: boolean

  @Field(type => [String], { nullable: true, description: "" })
  @Column({ nullable: true })
  aggregations: string[]

  @Field(type => [String], { nullable: true, description: "" })
  @Column({ nullable: true })
  artist_ids: string[]

  @Field({ nullable: true, description: "" })
  @Column({ nullable: true })
  artist_id: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  at_auction: boolean

  @Field({ nullable: true })
  @Column({ nullable: true })
  color: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  dimension_range: string

  @Field(type => [String], { nullable: true })
  @Column({ nullable: true })
  extra_aggregation_gene_ids: string[]

  @Field({ nullable: true })
  @Column({ nullable: true })
  include_artworks_by_followed_artists: boolean

  @Field({ nullable: true })
  @Column({ nullable: true })
  include_medium_filter_in_aggregation: boolean

  @Field({ nullable: true })
  @Column({ nullable: true })
  inquireable_only: boolean

  @Field({ nullable: true })
  @Column({ nullable: true })
  for_sale: boolean

  @Field({ nullable: true })
  @Column({ nullable: true })
  gene_id: string

  @Field(type => [String], { nullable: true })
  @Column({ nullable: true })
  gene_ids: string[]

  @Field({ nullable: true })
  @Column({ nullable: true })
  height: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  width: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  medium: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  period: string

  @Field(type => [String], { nullable: true })
  @Column({ nullable: true })
  periods: [string]

  @Field(type => [String], { nullable: true })
  @Column({ nullable: true })
  major_periods: [string]

  @Field(type => ID, { nullable: true })
  @Column({ nullable: true })
  partner_id: string

  @Field(type => [String], { nullable: true })
  @Column({ nullable: true })
  partner_cities: [string]

  @Field({ nullable: true })
  @Column({ nullable: true })
  price_range: string

  @Field(type => Int, { nullable: true })
  @Column({ nullable: true })
  page: number

  @Field(type => ID, { nullable: true })
  @Column({ nullable: true })
  sale_id: string

  @Field(type => Int, { nullable: true })
  @Column({ nullable: true })
  size: number

  @Field({ nullable: true })
  @Column({ nullable: true })
  sort: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  tag_id: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  keyword: string
}
