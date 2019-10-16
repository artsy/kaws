import { Field, ID, Int, ObjectType } from "type-graphql"
import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm"

@ObjectType()
@Entity()
export class CollectionQuery {
  @Field(type => ID, { nullable: true })
  @ObjectIdColumn()
  id: ObjectID

  @Field(type => ID, { nullable: true })
  @ObjectIdColumn({ name: "id" })
  internalID: ObjectID

  @Field({ nullable: true, description: "" })
  @Column({ nullable: true })
  acquireable?: boolean

  @Field(type => [String], { nullable: true, description: "" })
  @Column({ nullable: true })
  aggregations?: string[] = []

  @Field(type => [String], {
    nullable: true,
    description: "",
    deprecationReason: "Prefer artistIDs",
  })
  @Column({ nullable: true })
  artist_ids?: string[] = []

  @Field(type => [String], { nullable: true, description: "" })
  @Column({ name: "artist_ids", nullable: true })
  artistIDs?: string[] = []

  @Field({
    nullable: true,
    description: "",
    deprecationReason: "Prefer artistID",
  })
  @Column({ nullable: true })
  artist_id?: string

  @Field({ nullable: true, description: "" })
  @Column({ name: "artist_id", nullable: true })
  artistID?: string

  @Field({ nullable: true, deprecationReason: "Prefer atAuction" })
  @Column({ nullable: true })
  at_auction?: boolean

  @Field({ nullable: true })
  @Column({ name: "at_auction", nullable: true })
  atAuction?: boolean

  @Field({ nullable: true })
  @Column({ nullable: true })
  color?: string

  @Field({ nullable: true, deprecationReason: "Prefer dimensionRange" })
  @Column({ nullable: true })
  dimension_range?: string

  @Field({ nullable: true })
  @Column({ name: "dimension_range", nullable: true })
  dimensionRange?: string

  @Field(type => [String], {
    nullable: true,
    deprecationReason: "prefer extraAggregationGeneIDs",
  })
  @Column({ nullable: true })
  extra_aggregation_gene_ids?: string[]

  @Field(type => [String], { nullable: true })
  @Column({ name: "extra_aggregation_gene_ids", nullable: true })
  extraAggregationGeneIDs?: string[]

  @Field({
    nullable: true,
    deprecationReason: "Prefer includeArtworksByFollowedArtists",
  })
  @Column({ nullable: true })
  include_artworks_by_followed_artists?: boolean

  @Field({ nullable: true })
  @Column({ name: "include_artworks_by_followed_artists", nullable: true })
  includeArtworksByFollowedArtists?: boolean

  @Field({
    nullable: true,
    deprecationReason: "Prefer includeMediumFilterInAggregation",
  })
  @Column({ nullable: true })
  include_medium_filter_in_aggregation?: boolean

  @Field({ nullable: true })
  @Column({ name: "include_medium_filter_in_aggregation", nullable: true })
  includeMediumFilterInAggregation?: boolean

  @Field({ nullable: true, deprecationReason: "Prefer inquireableOnly" })
  @Column({ nullable: true })
  inquireable_only?: boolean

  @Field({ nullable: true })
  @Column({ name: "inquireable_only", nullable: true })
  inquireableOnly?: boolean

  @Field({ nullable: true, deprecationReason: "Prefer forSale" })
  @Column({ nullable: true })
  for_sale?: boolean

  @Field({ nullable: true })
  @Column({ name: "for_sale", nullable: true })
  forSale?: boolean

  @Field({ nullable: true, deprecationReason: "Prefer geneID" })
  @Column({ nullable: true })
  gene_id?: string

  @Field({ nullable: true })
  @Column({ name: "gene_id", nullable: true })
  geneID?: string

  @Field(type => [String], {
    nullable: true,
    deprecationReason: "Prefer geneIDs",
  })
  @Column({ nullable: true })
  gene_ids?: string[] = []

  @Field(type => [String], { nullable: true })
  @Column({ name: "gene_ids", nullable: true })
  geneIDs?: string[] = []

  @Field({ nullable: true })
  @Column({ nullable: true })
  height?: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  width?: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  medium?: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  period?: string

  @Field(type => [String], { nullable: true })
  @Column({ nullable: true })
  periods?: string[]

  @Field(type => [String], {
    nullable: true,
    deprecationReason: "Prefer majorPeriods",
  })
  @Column({ nullable: true })
  major_periods?: string[]

  @Field(type => [String], { nullable: true })
  @Column({ name: "major_periods", nullable: true })
  majorPeriods?: string[]

  @Field({
    nullable: true,
    description: "True for works that are not nude or provocative",
  })
  @Column({ nullable: true })
  marketable?: boolean

  @Field(type => ID, { nullable: true, deprecationReason: "Prefer partnerID" })
  @Column({ nullable: true })
  partner_id?: string

  @Field(type => ID, { nullable: true })
  @Column({ name: "partner_id", nullable: true })
  partnerID?: string

  @Field(type => [String], {
    nullable: true,
    deprecationReason: "Prefer partnerCities",
  })
  @Column({ nullable: true })
  partner_cities?: string[]

  @Field(type => [String], { nullable: true })
  @Column({ name: "partner_cities", nullable: true })
  partnerCities?: string[]

  @Field({ nullable: true, deprecationReason: "Prefer priceRange" })
  @Column({ nullable: true })
  price_range?: string

  @Field({ nullable: true })
  @Column({ name: "price_range", nullable: true })
  priceRange?: string

  @Field(type => Int, { nullable: true })
  @Column({ nullable: true })
  page?: number

  @Field(type => ID, { nullable: true, deprecationReason: "Prefer saleID" })
  @Column({ nullable: true })
  sale_id?: string

  @Field(type => ID, { nullable: true })
  @Column({ name: "sale_id", nullable: true })
  saleID?: string

  @Field(type => Int, { nullable: true })
  @Column({ nullable: true })
  size?: number

  @Field({ nullable: true })
  @Column({ nullable: true })
  sort?: string

  @Field({ nullable: true, deprecationReason: "Prefer tagID" })
  @Column({ nullable: true })
  tag_id?: string

  @Field({ nullable: true })
  @Column({ name: "tag_id", nullable: true })
  tagID?: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  keyword?: string
}
