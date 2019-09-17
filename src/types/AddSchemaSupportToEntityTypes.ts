import { u16 } from '@polkadot/types';
import EntityId from '../srml-types/versioned-store/EntityId';
import { VecClassPropertyValue } from '../srml-types/versioned-store';

export type AddSchemaSupportToEntityInputType = {
  // TODO finish
}

export type AddSchemaSupportToEntityOutputType = {
  entity_id: EntityId,
  schema_id: u16,
  property_values: VecClassPropertyValue
}
