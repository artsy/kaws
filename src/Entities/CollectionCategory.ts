import { Field, ID, ObjectType } from "type-graphql"
import { ObjectID, ObjectIdColumn } from "typeorm"

@ObjectType()
export class Category {
  @Field(type => ID)
  @ObjectIdColumn()
  id: ObjectID

  @Field()
  name: string
}