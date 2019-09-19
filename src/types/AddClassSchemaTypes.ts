import { ClassIdInputType } from './ClassIdType';
import ClassId from '../srml-types/versioned-store/ClassId';
import { VecProperty, VecU16 } from '../srml-types/versioned-store';
import { PropertyName, PropertyInputType } from './PropertyTypes';

export type AddClassSchemaInputType = {
  classId: ClassIdInputType,
  existingProperties: PropertyName[],
  newProperties: PropertyInputType[]
}

export type AddClassSchemaOutputType = {
  class_id: ClassId,
  existing_properties: VecU16,
  new_properties: VecProperty
}