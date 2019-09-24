import EntityId from '@joystream/types/lib/versioned-store/EntityId';
import { VecU16 } from '@joystream/types/lib/versioned-store';
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
