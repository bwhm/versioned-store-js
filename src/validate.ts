import * as Ajv from 'ajv';

import * as CreateClassSchema from './schemas/CreateClass.schema.json'
import * as AddClassSchemaSchema from './schemas/AddClassSchema.schema.json'
import * as CreateEntitySchema from './schemas/CreateEntity.schema.json'
import * as AddSchemaSupportToEntitySchema from './schemas/AddSchemaSupportToEntity.schema.json'
import * as UpdateEntityPropertiesSchema from './schemas/UpdateEntityProperties.schema.json'
import * as RemoveEntityPropertiesSchema from './schemas/RemoveEntityProperties.schem.json'

import { CreateClassInputType } from './types/CreateClassTypes.js';
import { AddClassSchemaInputType } from './types/AddClassSchemaTypes.js';
import { CreateEntityInputType } from './types/CreateEntityTypes.js';
import { AddSchemaSupportToEntityInputType } from './types/AddSchemaSupportToEntityTypes.js';
import { UpdateEntityPropertiesInputType } from './types/UpdateEntityPropertiesTypes.js'
import { RemoveEntityPropertiesInputType } from './types/RemoveEntityPropertiesTypes.js'

const ajv = new Ajv({ allErrors: true });
const CreateClassAjv = ajv.compile(CreateClassSchema);
const AddClassSchemaAjv = ajv.compile(AddClassSchemaSchema);
const CreateEntityAjv = ajv.compile(CreateEntitySchema);
const AddSchemaSupportToEntityAjv = ajv.compile(AddSchemaSupportToEntitySchema);
const UpdateEntityPropertiesAjv = ajv.compile(UpdateEntityPropertiesSchema);
const RemoveEntityPropertiesAjv = ajv.compile(RemoveEntityPropertiesSchema);

type ValidationResult = {
  valid: boolean
  errors?: Ajv.ErrorObject[]
}

function validateSchema (validateFn: Ajv.ValidateFunction, obj: any): ValidationResult {
  return validateFn(obj)
    ? { valid: true }
    : { valid: false, errors: validateFn.errors };
}

export function validateCreateClass(newClass: CreateClassInputType): ValidationResult {
  return validateSchema(CreateClassAjv, newClass);
}

export function validateAddClassSchema(newSchema: AddClassSchemaInputType): ValidationResult {
  return validateSchema(AddClassSchemaAjv, newSchema);
}

export function validateCreateEntity(newEntity: CreateEntityInputType): ValidationResult {
  return validateSchema(CreateEntityAjv, newEntity);
}

export function validateAddSchemaSupportToEntity(entitySchema: AddSchemaSupportToEntityInputType): ValidationResult {
  return validateSchema(AddSchemaSupportToEntityAjv, entitySchema);
}

export function validateUpdateEntityProperties(newPropValues: UpdateEntityPropertiesInputType): ValidationResult {
  return validateSchema(UpdateEntityPropertiesAjv, newPropValues);
}

export function validateRemoveEntityPropertiesAjv(propNames: RemoveEntityPropertiesInputType): ValidationResult {
  return validateSchema(RemoveEntityPropertiesAjv, propNames);
}