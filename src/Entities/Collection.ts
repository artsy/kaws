import { Field, ID, ObjectType } from "type-graphql"
import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm"
import { CollectionQuery } from "./CollectionQuery"
import { Image } from "./Image"

@ObjectType({ description: "Object representing a collection page" })
@Entity()
export class Collection {
  @Field(type => ID)
  @ObjectIdColumn()
  id: ObjectID

  @Field({ description: "slug version of title, used for pretty URLs (e.g. `kaws-prints` for Kaws Prints " })
  @Column()
  slug: string

  @Field({ description: "Name of the collection" })
  @Column()
  title: string

  @Field({
    nullable: true,
    description: "Description of the collection which can include links to other collections",
  })
  @Column({ nullable: true })
  description?: string

  @Field(type => Image, { nullable: true, description: "Background image for the header of the collection page" })
  @Column(type => Image)
  headerImage?: Image

  @Field(type => String, { description: "Set of keywords used for SEO purposes" })
  @Column()
  keywords: string

  @Field(type => CollectionQuery, { description: "Structured object used to build filtered artworks query" })
  @Column(type => CollectionQuery)
  query: CollectionQuery

  @Field()
  @Column()
  createdAt: Date

  @Field()
  @Column()
  updatedAt: Date
}
