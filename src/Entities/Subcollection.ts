import { Field, ObjectType } from "type-graphql"
import { Column, Entity } from "typeorm"

@ObjectType()
@Entity()
export class Subcollection {
  @Field(type => String!, { nullable: false })
  @Column()
  name: string

  @Field(type => [String!]!, { nullable: false })
  @Column()
  members: string[] = []
}
