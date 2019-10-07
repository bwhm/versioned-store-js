import { arrayToMultiLineString } from './printers';
import {
  validateCreateClass, validateAddClassSchema, validateCreateEntity,
  validateAddSchemaSupportToEntity, validateUpdateEntityPropertyValues
} from '../validate';

const program = require('commander');

const opt_showCommands = `showCommands`

// TODO read this:
// https://github.com/tj/commander.js/#commands

program
  .version('0.1.0')
  .description('CLI for Substrate versioned store')
  .option(`-a, --${opt_showCommands}`, `Show available commands`)
  .parse(process.argv);

const ValidationFunctions = {
  validateCreateClass,
  validateAddClassSchema,
  validateCreateEntity,
  validateAddSchemaSupportToEntity,
  validateUpdateEntityPropertyValues
}

const ValidationFunctionNames = Object.keys(ValidationFunctions)

function exit () {
  process.exit(0)
}

if (program[opt_showCommands]) {
  console.log(`Validation commands:`)
  console.log(arrayToMultiLineString(ValidationFunctionNames))
  console.log()
  exit()
}
