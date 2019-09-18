import { AddClassSchemaInputType, AddClassSchemaOutputType, PropertyNameToIndexMap, PropertyInputType } from './types/AddClassSchemaTypes';
import { validateAddClassSchema } from './validate';
import ClassId from './srml-types/versioned-store/ClassId';
import { Property, VecU16, VecProperty } from './srml-types/versioned-store';
import PropertyType from './srml-types/versioned-store/PropertyType';
import * as PT from './srml-types/versioned-store/PropertyType';
import { u16, Bool, Text } from '@polkadot/types';
import { TransformationResult } from './transform';

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

function transformPropertyType(prop: PropertyInputType): TransformationResult<string, PropertyType> {

  const ok = (typeEnum: PT.PropertyTypeEnum) => {
    return { result: new PropertyType(typeEnum) };
  }

  switch (prop.type) {

    // Primitives:

    case 'None':        return ok(new PT.None);
    case 'Bool':        return ok(new PT.Bool);
    case 'Uint16':      return ok(new PT.Uint16);
    case 'Uint32':      return ok(new PT.Uint32);
    case 'Uint64':      return ok(new PT.Uint64);
    case 'Int16':       return ok(new PT.Int16);
    case 'Int32':       return ok(new PT.Int32);
    case 'Int64':       return ok(new PT.Int64);
    case 'Text':        return ok(new PT.Text(prop.maxTextLength));
    case 'Internal':    return ok(new PT.Internal(prop.classId));

    // Vectors:

    case 'BoolVec':     return ok(new PT.BoolVec(prop.maxItems));
    case 'Uint16Vec':   return ok(new PT.Uint16Vec(prop.maxItems));
    case 'Uint32Vec':   return ok(new PT.Uint32Vec(prop.maxItems));
    case 'Uint64Vec':   return ok(new PT.Uint64Vec(prop.maxItems));
    case 'Int16Vec':    return ok(new PT.Int16Vec(prop.maxItems));
    case 'Int32Vec':    return ok(new PT.Int32Vec(prop.maxItems));
    case 'Int64Vec':    return ok(new PT.Int64Vec(prop.maxItems));
    case 'TextVec':     return ok(new PT.TextVec(prop.maxItems, prop.maxTextLength));
    case 'InternalVec': return ok(new PT.InternalVec(prop.maxItems, prop.classId));

    default: {
      return { error: `Unknown property type name: ${prop.type}` };
    }
  }
}
