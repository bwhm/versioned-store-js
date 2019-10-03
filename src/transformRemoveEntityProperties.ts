import { validateRemoveEntityProperties } from './validate';
import { VecU16 } from '@joystream/types/lib/versioned-store';
import { u16 } from '@polkadot/types';
import { RemoveEntityPropertiesInputType, RemoveEntityPropertiesOutputType } from './types/RemoveEntityPropertiesTypes';
import EntityId from '@joystream/types/lib/versioned-store/EntityId';
import { TransformationResult, wrapValidationErrors } from './transform';
import { PropertyByNameMap } from './types/PropertyTypes';

export function transformRemoveEntityProperties(
  inputData: RemoveEntityPropertiesInputType,
  propMap: PropertyByNameMap
): TransformationResult<string[], RemoveEntityPropertiesOutputType> {
  
  const validation = validateRemoveEntityProperties(inputData);
  if (!validation.valid) {
    return wrapValidationErrors(validation)
  }

  const allErrors: string[] = [];
  const propIds: u16[] = [];

  inputData.propertyNames.forEach(propName => {
    if (propMap.has(propName)) {
      const propIndex = propMap.get(propName).index;
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
