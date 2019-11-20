import { Substrate } from "../cli/substrate";
import { arrayToOneLineString, prettyClass, prettyEntity } from '../cli/printers';
import { AddClassSchemaInputType } from '../types/AddClassSchemaTypes';
import ClassPermissions from '@joystream/types/lib/versioned-store/permissions/ClassPermissions';
import EntityPermissions from '@joystream/types/lib/versioned-store/permissions/EntityPermissions';
import { CredentialSet, Credential } from '@joystream/types/lib/versioned-store/permissions/credentials';
import { bool, u32, Option } from '@polkadot/types';
import { ReferenceConstraint, NoConstraint } from '@joystream/types/lib/versioned-store/permissions/reference-constraint';

const CREDENTIAL_ONE = new u32(1);

const CLASS_PERMISSIONS = new ClassPermissions({
  entity_permissions: new EntityPermissions({
    update: new CredentialSet([CREDENTIAL_ONE]),
    maintainer_has_all_permissions: new bool(true),
  }),
  entities_can_be_created: new bool(true),
  add_schemas: new CredentialSet([CREDENTIAL_ONE]),
  create_entities: new CredentialSet([CREDENTIAL_ONE]),
  reference_constraint: new ReferenceConstraint({'NoConstraint': new NoConstraint()}),
  admins: new CredentialSet([]),
  last_permissions_update: new u32(0), // BlockNumber
});

// tslint:disable-next-line:max-func-body-length
async function main() {
  const sub = new Substrate();
  await sub.connect();
  sub.setKeypair({
    uri: '//Alice',
    type: 'sr25519'
  })

  // const ALICE = sub.keypair.address;

  // Create class
  // ------------------------------------------

  const newClass = {
    name: 'Podcast',
    description: 'Desc of podcast class'
  }

  const classId = await sub.txCreateClass(newClass, CLASS_PERMISSIONS)

  // Get all class ids
  // ------------------------------------------

  const allClassIds = await sub.getAllClassIds()
    .catch(err => console.log('Failed to get list of class ids from Substrate.', err));

  console.log(`All class ids:`)
  console.log(arrayToOneLineString(allClassIds))

  // Add new schema to class
  // ------------------------------------------

  const newClassSchema: AddClassSchemaInputType = {
    classId,
    newProperties: [
      // {
      //   required: true,
      //   type: 'Uint16',
      //   name: 'episode',
      //   description: 'A episode nubmer in this podcast'
      // },
      {
        required: true,
        type: 'Text',
        name: 'author',
        description: 'Author of this podcast episode',
        maxTextLength: 51
      },
      {
        required: false,
        type: 'TextVec',
        name: 'guests',
        description: 'Guests in this podcast episode',
        maxItems: 11,
        maxTextLength: 61
      }
    ]
  };

  const schemaId = await sub.txAddClassSchema(newClassSchema, new Option(Credential, CREDENTIAL_ONE))

  // Create new entity
  // ------------------------------------------

  const newEntity = { classId }
  const entityId = await sub.txCreateEntity(newEntity, new Option(Credential, CREDENTIAL_ONE))

  // Add schema support to entity
  // ------------------------------------------

  const schema_with_values = {
    entityId,
    schemaId,
    propertyValues: [
      // {
      //   name: 'episode',
      //   value: 123
      // },
      {
        name: 'author',
        value: 'Alice'
      },
      {
        name: 'guests',
        value: [
          'Bob',
          'Charlie'
        ]
      }
    ]
  }

  await sub.txAddSchemaSupportToEntity(schema_with_values, new Option(Credential, CREDENTIAL_ONE), true)

  const new_property_values ={
    entityId,
    newPropertyValues: [
      {
        name: 'author',
        value: 'Dave'
      },
      {
        name: 'guests',
        value: [
          'Eve',
          'Freddie'
        ]
      }
    ]
  }

  await sub.txUpdateEntityPropertyValues(new_property_values, new Option(Credential, CREDENTIAL_ONE), true)

  // Get Class
  // ------------------------------------------

  const clazz = await sub.getClassById(classId)
    .catch(err => console.log(`Failed to get class by id '${classId}'`, err));

  console.log(`Class by id`, classId, prettyClass(clazz))

  // Get all entity ids
  // ------------------------------------------

  const allEntityIds = await sub.getAllEntityIds()
    .catch(err => console.log('Failed to get list of all entity ids from Substrate.', err));

  console.log(`All entity ids:`)
  console.log(arrayToOneLineString(allEntityIds))

  // Get Entity
  // ------------------------------------------

  const entity = await sub.getEntityById(classId)
    .catch(err => console.log(`Failed to get entity by id '${entityId}'`, err));

  const entityAsText = await prettyEntity(entity, sub)
  console.log(`Entity by id`, entityId, entityAsText)

  // Update the class permissions with sudo call
  await sub.makeSudoCall(
    sub.vsTx.setClassAdmins(classId, new CredentialSet([CREDENTIAL_ONE]))
  );

  sub.disconnect();
}

main()
