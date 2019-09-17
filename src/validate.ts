import * as createClassSchema from './schemas/CreateClass.schema.json'
import * as addClassSchemaSchema from './schemas/AddClassSchema.schema.json'
import * as createEntitySchema from './schemas/CreateEntity.schema.json'
import * as addSchemaSupportToEntitySchema from './schemas/AddSchemaSupportToEntity.schema.json'

import { CreateClassInputType } from './types/CreateClassTypes.js';
import { AddClassSchemaInputType } from './types/AddClassSchemaTypes.js';

import * as Ajv from 'ajv';
import { CreateEntityInputType } from './types/CreateEntityTypes.js';
import { AddSchemaSupportToEntityInputType } from './types/AddSchemaSupportToEntityTypes.js';
const ajv = new Ajv({ allErrors: true });
const createClassAjv = ajv.compile(createClassSchema);
const addClassSchemaAjv = ajv.compile(addClassSchemaSchema);
const createEntityAjv = ajv.compile(createEntitySchema);
const addSchemaSupportToEntityAjv = ajv.compile(addSchemaSupportToEntitySchema);

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
  return validateSchema(createClassAjv, newClass);
}

export function validateAddClassSchema(newSchema: AddClassSchemaInputType): ValidationResult {
  return validateSchema(addClassSchemaAjv, newSchema);
}

export function validateCreateEntity(newEntity: CreateEntityInputType): ValidationResult {
  return validateSchema(createEntityAjv, newEntity);
}

export function validateAddSchemaSupportToEntity(entitySchema: AddSchemaSupportToEntityInputType): ValidationResult {
  return validateSchema(addSchemaSupportToEntityAjv, entitySchema);
}