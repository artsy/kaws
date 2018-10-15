import { InputType } from "type-graphql"
import { Collection } from "../Entities"

@InputType()
export class AddCollectionInput extends Collection {}
