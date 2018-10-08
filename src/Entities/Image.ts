import { Field, ID, ObjectType } from "type-graphql"
import { ObjectID, ObjectIdColumn } from "typeorm"

@ObjectType()
export class Image {
  @Field(type => ID)
  @ObjectIdColumn()
  id: ObjectID

  @Field()
  small: string

  @Field()
  medium: string

  @Field()
  large: string
}
