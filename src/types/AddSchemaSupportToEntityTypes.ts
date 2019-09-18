import { u16 } from '@polkadot/types';
import EntityId from '../srml-types/versioned-store/EntityId';
import { VecClassPropertyValue } from '../srml-types/versioned-store';
import { EntityIdInputType } from './EntityIdType';

type SinglePropertyValue = boolean | number | string | EntityIdInputType;

export type PropertyValueInputType = null | SinglePropertyValue | SinglePropertyValue[];

export type PropertyNameAndValueInputType = {
  name: string,
  value: PropertyValueInputType
}

export type AddSchemaSupportToEntityInputType = {
  entityId: number,
  schemaId: number,
  propertyValues?: PropertyNameAndValueInputType[]
}

export type AddSchemaSupportToEntityOutputType = {
  entity_id: EntityId,
  schema_id: u16,
  property_values: VecClassPropertyValue
}
