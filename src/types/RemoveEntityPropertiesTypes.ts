import EntityId from '../srml-types/versioned-store/EntityId';
import { VecU16 } from '../srml-types/versioned-store';
import { EntityIdInputType } from './EntityIdType';
import { PropertyName } from './PropertyTypes';

export type RemoveEntityPropertiesInputType = {
  entityId: EntityIdInputType
  propertyNames: PropertyName[]
}

export type RemoveEntityPropertiesOutputType = {
  entity_id: EntityId,
  property_ids: VecU16
}
