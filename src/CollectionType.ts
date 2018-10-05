import { Field, ObjectType } from "type-graphql"
import { CollectionQuery } from "./CollectionQueryType"

@ObjectType()
export class Image {
  @Field()
  small: string

  @Field()
  medium: string

  @Field()
  large: string
}

@ObjectType({ description: "Object representing collection" })
export class Collection {
  @Field()
  id: string

  @Field()
  slug: string

  @Field()
  title: string

  @Field({ nullable: true, description: "The recipe description with preparation info" })
  description?: string

  @Field(type => Image, { nullable: true })
  headerImage?: object

  @Field(type => [String])
  keywords: string[]

  @Field(type => CollectionQuery)
  query: CollectionQuery

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
