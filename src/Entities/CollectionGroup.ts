import { Field, ObjectType, registerEnumType } from "type-graphql"
import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm"
import { Collection } from "./Collection"

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
  @ObjectIdColumn()
  id: ObjectID

  @ObjectIdColumn({ name: "id" })
  internalID: ObjectID

  @Field(type => GroupType)
  @Column()
  groupType: GroupType

  @Field(type => String!, { nullable: false })
  @Column()
  name: string

  @Field(type => [Collection], { nullable: false })
  @Column()
  members: Collection[] = []
}
