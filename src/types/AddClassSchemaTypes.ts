import { ClassIdInputType } from './ClassIdType';
import ClassId from '../srml-types/versioned-store/ClassId';
import { VecProperty, VecU16 } from '../srml-types/versioned-store';

export type PropertyName = string;

export type PropertyIndex = number;

export type PropertyInputType = {
  type: PropertyTypeName
  required: boolean
  name: string
  description: string
  classId?: ClassIdInputType
  maxItems?: number
  maxTextLength?: number
};

export type PropertyTypeName =
  'None' |
  'Bool' |
  'Uint16' |
  'Uint32' |
  'Uint64' |
  'Int16' |
  'Int32' |
  'Int64' |
  'Text' |
  'Internal' |

  // Vectors:

  'BoolVec' |
  'Uint16Vec' |
  'Uint32Vec' |
  'Uint64Vec' |
  'Int16Vec' |
  'Int32Vec' |
  'Int64Vec' |
  'TextVec' |
  'InternalVec'
;

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

export type PropertyNameToIndexMap =
  Map<PropertyName, PropertyIndex>;
