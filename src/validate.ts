import * as newClassSchema from './schemas/new-class.schema.json' 
import * as newSchemaSchema from './schemas/new-schema.schema.json'

import { NewClassInputType } from './types/NewClassType.js';
import { NewSchemaInputType } from './types/NewSchemaType.js';

import * as Ajv from 'ajv';
const ajv = new Ajv({ allErrors: true });
const newClassAjv = ajv.compile(newClassSchema);
const newSchemaAjv = ajv.compile(newSchemaSchema);

type ValidationResult = {
  valid: boolean
  errors?: Ajv.ErrorObject[]
}

function validateSchema (validateFn: Ajv.ValidateFunction, obj: any): ValidationResult {
  return validateFn(obj)
    ? { valid: true }
    : { valid: false, errors: validateFn.errors };
}

export function validateNewClass(newClass: NewClassInputType): ValidationResult {
  return validateSchema(newClassAjv, newClass);
}

export function validateNewSchema(newSchema: NewSchemaInputType): ValidationResult {
  return validateSchema(newSchemaAjv, newSchema);
}
