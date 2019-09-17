import EntityId from '../srml-types/versioned-store/EntityId';
import { VecClassPropertyValue } from '../srml-types/versioned-store';
import { EntityIdInputType } from './EntityIdType';

export type UpdateEntityPropertiesInputType = {
  entityId: EntityIdInputType
  // TODO finish
}

export type UpdateEntityPropertiesOutputType = {
  entity_id: EntityId,
  new_property_values: VecClassPropertyValue
}
