import { Field, Float, Int, ObjectType } from "type-graphql"
import { Entity } from "typeorm"

@Entity()
@ObjectType({ description: "Object representing cooking recipe" })
export class Collection {
  @Field()
  id: string

  @Field()
  title: string

  @Field({ nullable: true, description: "The recipe description with preparation info" })
  description: string

  @Field()
  headerImage: object

  @Field()
  keywords: string[]

  @Field()
  query: object

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
