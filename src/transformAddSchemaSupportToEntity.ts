import { PropertyNameToIndexMap, PropertyTypeName, PropertyNameToTypeMap as PropertyNameToTypeNameMap } from './types/AddClassSchemaTypes';
import { validateAddSchemaSupportToEntity } from './validate';
import { ClassPropertyValue, VecClassPropertyValue } from './srml-types/versioned-store';
import * as PV from './srml-types/versioned-store/PropertyValue';
import { u16 } from '@polkadot/types';
import { AddSchemaSupportToEntityInputType, AddSchemaSupportToEntityOutputType, PropertyValueInputType } from './types/AddSchemaSupportToEntityTypes';
import { PropertyValue } from './srml-types/versioned-store/PropertyValue';
import EntityId from './srml-types/versioned-store/EntityId';
import { EntityIdInputType } from './types/EntityIdType';
import { TransformationResult } from './transform';

export function transformAddSchemaSupportToEntity(
  inputData: AddSchemaSupportToEntityInputType,
  propIndexMap: PropertyNameToIndexMap,
  propTypeMap: PropertyNameToTypeNameMap
): TransformationResult<string[], AddSchemaSupportToEntityOutputType> {
  
  const validation = validateAddSchemaSupportToEntity(inputData);
  if (!validation.valid) {
    const errCount = validation.errors.length;
    return { error: [ `Schema validation failed. ${errCount} errors.` ] };
  }

  const allErrors: string[] = [];
  const propValues: ClassPropertyValue[] = [];

  inputData.propertyValues.forEach(prop => {
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
      schema_id: new u16(inputData.schemaId),
      property_values: new VecClassPropertyValue()
    }
  }
}

function transformPropertyValue(propType: PropertyTypeName, value: PropertyValueInputType): TransformationResult<string, PropertyValue> {

  const ok = (typeEnum: PV.PropertyValueEnum) => {
    return { result: new PropertyValue(typeEnum) };
  }

  switch (propType) {

    // Primitives:

    case 'None':        return ok(new PV.None);
    case 'Bool':        return ok(new PV.Bool(value as boolean));
    case 'Uint16':      return ok(new PV.Uint16(value as number));
    case 'Uint32':      return ok(new PV.Uint32(value as number));
    case 'Uint64':      return ok(new PV.Uint64(value as number));
    case 'Int16':       return ok(new PV.Int16(value as number));
    case 'Int32':       return ok(new PV.Int32(value as number));
    case 'Int64':       return ok(new PV.Int64(value as number));
    case 'Text':        return ok(new PV.Text(value as string));
    case 'Internal':    return ok(new PV.Internal(value as EntityIdInputType));

    // Vectors:

    case 'BoolVec':     return ok(new PV.BoolVec(value as boolean[]));
    case 'Uint16Vec':   return ok(new PV.Uint16Vec(value as number[]));
    case 'Uint32Vec':   return ok(new PV.Uint32Vec(value as number[]));
    case 'Uint64Vec':   return ok(new PV.Uint64Vec(value as number[]));
    case 'Int16Vec':    return ok(new PV.Int16Vec(value as number[]));
    case 'Int32Vec':    return ok(new PV.Int32Vec(value as number[]));
    case 'Int64Vec':    return ok(new PV.Int64Vec(value as number[]));
    case 'TextVec':     return ok(new PV.TextVec(value as string[]));
    case 'InternalVec': return ok(new PV.InternalVec(value as EntityIdInputType[]));

    default: {
      return { error: `Unknown property type name: ${propType}` };
    }
  }
}
