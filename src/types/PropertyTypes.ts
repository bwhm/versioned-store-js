import { EntityIdInputType } from './EntityIdType';
import { ClassIdInputType } from './ClassIdType';

export type PropertyName = string;

export type PropertyIndex = number;

export type SinglePropertyValue = boolean | number | string | EntityIdInputType;

export type PropertyValueInputType = null | SinglePropertyValue | SinglePropertyValue[];

export type PropertyNameAndValueInputType = {
  name: string,
  value: PropertyValueInputType
}

export type PropertyNameToIndexMap =
  Map<PropertyName, PropertyIndex>;

export type PropertyNameToTypeMap =
  Map<PropertyName, PropertyTypeName>;

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