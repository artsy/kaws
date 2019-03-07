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

  @Field({ nullable: true })
  @Column({ nullable: true })
  url?: string
}

@ObjectType()
@Entity()
export class CollectionFeaturedArtwork {
  @Field(type => ID, { nullable: true })
  @ObjectIdColumn()
  id: ObjectID

  @Field(type => CollectionFeaturedArtworkImage, {
    description: "Artwork image data",
  })
  @Column(type => CollectionFeaturedArtworkImage)
  image: CollectionFeaturedArtworkImage
}
