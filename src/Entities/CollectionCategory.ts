import { Field, ObjectType } from "type-graphql"
import { Collection } from "./Collection"

@ObjectType()
export class CollectionCategory {
  @Field()
  name: string

  @Field(type => [Collection])
  collections: [Collection]
}
