import { EntityIdInputType } from './EntityIdType';
import { ClassIdInputType } from './ClassIdType';
import PropertyTypeName from '@joystream/types/lib/versioned-store/PropertyTypeName';

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
  required?: boolean
  name: string
  description: string
  classId?: ClassIdInputType
  maxItems?: number
  maxTextLength?: number
};
