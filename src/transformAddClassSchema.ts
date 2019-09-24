import { AddClassSchemaInputType, AddClassSchemaOutputType } from './types/AddClassSchemaTypes';
import { validateAddClassSchema } from './validate';
import ClassId from '@joystream/types/lib/versioned-store/ClassId';
import { Property, VecU16, VecProperty } from '@joystream/types/lib/versioned-store';
import { u16, Bool, Text } from '@polkadot/types';
import { TransformationResult } from './transform';
import { PropertyNameToIndexMap } from './types/PropertyTypes';
import { transformPropertyType } from './transformPropertyType';

export function transformAddClassSchema(
  inputData: AddClassSchemaInputType,
  propMap: PropertyNameToIndexMap
): TransformationResult<string[], AddClassSchemaOutputType> {
  
  const validation = validateAddClassSchema(inputData);
  if (!validation.valid) {
    const errCount = validation.errors.length;
    return { error: [ `Schema validation failed. ${errCount} errors.` ] };
  }

  const allErrors: string[] = [];

  const existingProps: u16[] = [];
  inputData.existingProperties.forEach(propName => {
    if (propMap.has(propName)) {
      const propIndex = propMap.get(propName);
      existingProps.push(new u16(propIndex));
    } else {
      allErrors.push(`No property index provided for name '${propName}'.`);
    }
  });

  const newProps: Property[] = [];
  inputData.newProperties.forEach(prop => {
    const { error, result: prop_type } = transformPropertyType(prop);
    if (error) {
      allErrors.push(error)
    } else {
      newProps.push(new Property({
        prop_type,
        required: new Bool(prop.required),
        name: new Text(prop.name),
        description: new Text(prop.description)
      }));
    }
  });

  if (allErrors.length) {
    return { error: allErrors };
  }

  return {
    result: {
      class_id: new ClassId(inputData.classId),
      existing_properties: new VecU16(existingProps),
      new_properties: new VecProperty(newProps)
    }
  }
}
