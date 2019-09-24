import { validateUpdateEntityProperties } from './validate';
import { ClassPropertyValue, VecClassPropertyValue } from '@joystream/types/lib/versioned-store';
import { u16 } from '@polkadot/types';
import { UpdateEntityPropertiesInputType, UpdateEntityPropertiesOutputType } from './types/UpdateEntityPropertiesTypes';
import { PropertyValue } from '@joystream/types/lib/versioned-store/PropertyValue';
import EntityId from '@joystream/types/lib/versioned-store/EntityId';
import { TransformationResult } from './transform';
import { PropertyNameToIndexMap, PropertyNameToTypeMap } from './types/PropertyTypes';
import { transformPropertyValue } from './transformPropertyValue';

export function transformUpdateEntityProperties(
  inputData: UpdateEntityPropertiesInputType,
  propIndexMap: PropertyNameToIndexMap,
  propTypeMap: PropertyNameToTypeMap
): TransformationResult<string[], UpdateEntityPropertiesOutputType> {
  
  const validation = validateUpdateEntityProperties(inputData);
  if (!validation.valid) {
    const errCount = validation.errors.length;
    return { error: [ `Schema validation failed. ${errCount} errors.` ] };
  }

  const allErrors: string[] = [];
  const propValues: ClassPropertyValue[] = [];

  inputData.newPropertyValues.forEach(prop => {
    const { name, value } = prop;
    let propIndex: number;
    let propValue: PropertyValue;
    
    if (propIndexMap.has(name)) {
      propIndex = propIndexMap.get(name);
    } else {
      allErrors.push(`No property index provided for name '${name}'.`);
    }

    if (propTypeMap.has(name)) {
      const propType = propTypeMap.get(name);
      const { error, result } = transformPropertyValue(propType, value);
      propValue = result;
      if (error) {
        allErrors.push(error);
      }
    } else {
      allErrors.push(`No property type provided for name '${name}'.`);
    }

    if (propIndex && propValue) {
      propValues.push(new ClassPropertyValue({
        in_class_index: new u16(propIndex),
        value: propValue
      }));
    }
  });

  if (allErrors.length) {
    return { error: allErrors };
  }

  return {
    result: {
      entity_id: new EntityId(inputData.entityId),
      new_property_values: new VecClassPropertyValue()
    }
  }
}
