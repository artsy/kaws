import { Field, ID, Int, ObjectType } from "type-graphql"
import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm"

@ObjectType()
@Entity()
export class CollectionFeaturedArtworkImage {
  @Field(type => Int, { nullable: true })
  @Column({ nullable: true })
  aspectRatio?: number

  @Field(type => Int, { nullable: true })
  @Column({ nullable: true })
  height?: number

  @Field(type => Int, { nullable: true })
  @Column({ nullable: true })
  width?: number

  @Field(type => Int, { nullable: true })
  @Column({ nullable: true })
  position?: number

  @Field({ nullable: true })
  @Column({ nullable: true })
  url?: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  image_url?: string

  @Field(type => [String], { nullable: true })
  @Column("simple-array")
  versions?: string[]
}

@ObjectType()
@Entity()
export class CollectionFeaturedArtwork {
  @Field(type => ID, { nullable: true })
  @ObjectIdColumn()
  _id: ObjectID

  @Field({ nullable: true })
  @Column()
  id: string

  @Field(type => CollectionFeaturedArtworkImage, {
    description: "Artwork image data",
  })
  @Column(type => CollectionFeaturedArtworkImage)
  image: CollectionFeaturedArtworkImage
}
