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

function validateSchema (validateFn: Ajv.ValidateFunction, inputData: any): ValidationResult {
  return validateFn(inputData)
    ? { valid: true }
    : { valid: false, errors: validateFn.errors };
}

export function validateCreateClass(inputData: CreateClassInputType): ValidationResult {
  return validateSchema(CreateClassAjv, inputData);
}

export function validateAddClassSchema(inputData: AddClassSchemaInputType): ValidationResult {
  return validateSchema(AddClassSchemaAjv, inputData);
}

export function validateCreateEntity(inputData: CreateEntityInputType): ValidationResult {
  return validateSchema(CreateEntityAjv, inputData);
}

export function validateAddSchemaSupportToEntity(inputData: AddSchemaSupportToEntityInputType): ValidationResult {
  return validateSchema(AddSchemaSupportToEntityAjv, inputData);
}

export function validateUpdateEntityProperties(inputData: UpdateEntityPropertiesInputType): ValidationResult {
  return validateSchema(UpdateEntityPropertiesAjv, inputData);
}

export function validateRemoveEntityProperties(inputData: RemoveEntityPropertiesInputType): ValidationResult {
  return validateSchema(RemoveEntityPropertiesAjv, inputData);
}