import { validateRemoveEntityProperties } from './validate';
import { VecU16 } from '@joystream/types/lib/versioned-store';
import { u16 } from '@polkadot/types';
import { RemoveEntityPropertiesInputType, RemoveEntityPropertiesOutputType } from './types/RemoveEntityPropertiesTypes';
import EntityId from '@joystream/types/lib/versioned-store/EntityId';
import { TransformationResult } from './transform';
import { PropertyNameToIndexMap } from './types/PropertyTypes';

export function transformRemoveEntityProperties(
  inputData: RemoveEntityPropertiesInputType,
  propIndexMap: PropertyNameToIndexMap
): TransformationResult<string[], RemoveEntityPropertiesOutputType> {
  
  const validation = validateRemoveEntityProperties(inputData);
  if (!validation.valid) {
    const errCount = validation.errors.length;
    return { error: [ `Schema validation failed. ${errCount} errors.` ] };
  }

  const allErrors: string[] = [];
  const propIds: u16[] = [];

  inputData.propertyNames.forEach(propName => {
    if (propIndexMap.has(propName)) {
      const propIndex = propIndexMap.get(propName);
      propIds.push(new u16(propIndex));
    } else {
      allErrors.push(`No property index provided for name '${propName}'.`);
    }
  });

  if (allErrors.length) {
    return { error: allErrors };
  }

  return {
    result: {
      entity_id: new EntityId(inputData.entityId),
      property_ids: new VecU16(propIds)
    }
  }
}
