import { Field, ID, ObjectType } from "type-graphql"
import { Column, Entity, Index, ObjectID, ObjectIdColumn } from "typeorm"
import { CollectionGroup } from "./CollectionGroup"
import { CollectionQuery } from "./CollectionQuery"

@ObjectType({ description: "Object representing a collection page" })
@Entity()
export class Collection {
  @Field(type => ID)
  @ObjectIdColumn()
  id: ObjectID

  @Field(type => ID)
  @ObjectIdColumn({ name: "id" })
  internalID: ObjectID

  @Index({ unique: true })
  @Field({
    description:
      "slug version of title, used for pretty URLs (e.g. `kaws-prints` for Kaws Prints ",
  })
  @Column()
  slug: string

  @Field({ description: "Name of the collection" })
  @Column()
  title: string

  @Field({
    nullable: true,
    description:
      "Description of the collection which can include links to other collections",
  })
  @Column({ nullable: true })
  description?: string

  @Field({
    nullable: true,
    description: "Markdown alternate of description field contents.",
  })
  @Column({ nullable: true })
  descriptionMarkdown?: string

  @Field(type => Boolean, {
    description: "Collection has its description available as markdown",
  })
  @Column({ default: false })
  hasMarkdownDescription: boolean = false

  @Field(type => String, {
    nullable: true,
    description: "Background image for the header of the collection page",
  })
  @Column()
  headerImage?: string

  @Field(type => String, {
    nullable: true,
    description:
      "URL for Thumbnail image to be used when this collection is displayed.",
  })
  @Column()
  thumbnail?: string | null = null

  @Field(type => String, {
    description: "Set of keywords used for SEO purposes",
  })
  @Column()
  keywords: string

  @Field({
    nullable: true,
    description: "Image credit for the header image",
  })
  @Column({ nullable: true })
  credit?: string

  @Field(type => String, { description: "Category of the collection" })
  @Column()
  category: string

  @Field(type => CollectionQuery, {
    description: "Structured object used to build filtered artworks query",
  })
  @Column(type => CollectionQuery)
  query: CollectionQuery

  @Field()
  @Column()
  createdAt: Date

  @Field()
  @Column()
  updatedAt: Date

  @Field(type => Number, {
    nullable: true,
    description: "Suggested average price for included works",
    deprecationReason: "Prefer priceGuidance",
  })
  @Column({ nullable: true })
  price_guidance: number | null = null

  @Field(type => Number, {
    nullable: true,
    description: "Suggested average price for included works",
  })
  @Column({ name: "price_guidance", nullable: true })
  priceGuidance: number | null = null

  @Field(type => Boolean, {
    description: "Collection can be surfaced on editorial pages",
    deprecationReason: "Prefer showOnEditorial",
  })
  @Column({ default: false })
  show_on_editorial: boolean = false

  @Field(type => Boolean, {
    description: "Collection can be surfaced on editorial pages",
  })
  @Column({ name: "show_on_editorial", default: false })
  showOnEditorial: boolean = false

  @Field(type => Boolean, {
    description: "Collection has prioritized connection to artist",
    deprecationReason: "Prefer isFeaturedArtistContent",
  })
  @Column({ default: false })
  is_featured_artist_content: boolean = false

  @Field(type => Boolean, {
    description: "Collection has prioritized connection to artist",
  })
  @Column({ name: "is_featured_artist_content", default: false })
  isFeaturedArtistContent: boolean = false

  @Field(type => [CollectionGroup], {
    description: "CollectionGroups of this collection",
  })
  @Column(type => CollectionGroup)
  linkedCollections: CollectionGroup[]

  @Field(type => [String], {
    description:
      "IDs of artists that should be excluded from Featured Artists for this collection",
    nullable: true,
  })
  @Column({ nullable: true })
  featuredArtistExclusionIds?: string[] = []
}
