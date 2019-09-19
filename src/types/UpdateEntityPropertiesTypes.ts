import EntityId from '../srml-types/versioned-store/EntityId';
import { VecClassPropertyValue } from '../srml-types/versioned-store';
import { EntityIdInputType } from './EntityIdType';
import { PropertyNameAndValueInputType } from './PropertyTypes';

export type UpdateEntityPropertiesInputType = {
  entityId: EntityIdInputType
  newPropertyValues?: PropertyNameAndValueInputType[]
}

export type UpdateEntityPropertiesOutputType = {
  entity_id: EntityId,
  new_property_values: VecClassPropertyValue
}
