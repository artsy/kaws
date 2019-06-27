import { Field, ID, ObjectType, registerEnumType } from "type-graphql"
import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm"

export enum GroupType {
  ArtistSeries,
  FeaturedCollections,
  OtherCollections,
}

registerEnumType(GroupType, {
  name: "GroupTypes", // this one is mandatory
  description: "Available types of CollectionGroup", // this one is optional
})

@ObjectType()
@Entity()
export class CollectionGroup {
  @Field(type => ID)
  @ObjectIdColumn()
  id: ObjectID

  @Field(type => GroupType)
  @Column()
  groupType: GroupType

  @Field(type => String!, { nullable: false })
  @Column()
  name: string

  @Field(type => [String!]!, { nullable: false })
  @Column()
  members: string[] = []
}
