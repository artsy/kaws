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
  })
  @Column({ nullable: true })
  price_guidance: number | null = null

  @Field(type => Boolean, {
    description: "Collection can be surfaced on editorial pages",
  })
  @Column({ default: false })
  show_on_editorial: boolean = false

  @Field(type => Boolean, {
    description: "Collection has prioritized connection to artist",
  })
  @Column({ default: false })
  is_featured_artist_content: boolean = false

  @Field(type => [CollectionGroup], {
    description: "CollectionGroups of this collection",
  })
  @Column({ default: [] })
  linkedCollections: CollectionGroup[]
}
