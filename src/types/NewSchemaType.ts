import { ClassIdInputType } from './ClassIdType';
import ClassId from '../srml-types/versioned-store/ClassId';
import { VecProperty, VecU16 } from '../srml-types/versioned-store';

export type PropertyInputType = {
  type: string
  required: boolean
  name: string
  description: string
  classId?: ClassIdInputType
  maxItems?: number
  maxTextLength?: number
};

export type SchemaPropertyName = string;

export type NewSchemaInputType = {
  classId: ClassIdInputType,
  existingProperties: SchemaPropertyName[],
  newProperties: PropertyInputType[]
}

export type NewSchemaOutputType = {
  classId: ClassId,
  existingProperties: VecU16,
  newProperties: VecProperty
}

export type PropertyNameToIndexMap = Map<string, number>;
