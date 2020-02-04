import { Substrate } from './substrate';
import { transformClassSchemaByNameToId } from "./transform";
import { checkUniqueClassNamesFromJson } from './checks';
import { transformCreateClass, transformAddClassSchema } from "../transform";
import { CreateClassInputType,
  PropertyName, PropertyInputType, PropertyInputByClassNameType, PropertyByNameMap,
  AddClassSchemaInputType, AddClassSchemaInputByClassNameType, EntityIdInputType, AddSchemaSupportToEntityInputType
 } from '../types'
import ClassId from '@joystream/types/lib/versioned-store/ClassId';

export async function addSchemaSupportToEntity(entityId:EntityIdInputType, schemaId:number, sub?: Substrate): Promise<AddSchemaSupportToEntityInputType> {
  const schema_with_values: AddSchemaSupportToEntityInputType = {
    entityId,
    schemaId
  }
  return schema_with_values
}
