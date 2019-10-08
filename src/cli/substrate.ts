// tslint:disable-next-line:import-name
import BN from 'bn.js';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { KeypairType } from '@polkadot/util-crypto/types';
import { CodecResult, SubscriptionResult } from '@polkadot/api/promise/types';
import { SubmittableExtrinsic } from '@polkadot/api/SubmittableExtrinsic';

import { RpcEndpoints, greenItem } from './utils';
import { registerJoystreamTypes } from '@joystream/types';
import ClassId from '@joystream/types/lib/versioned-store/ClassId';
import EntityId from '@joystream/types/lib/versioned-store/EntityId';
import { Class, Entity } from '@joystream/types/lib/versioned-store';
import PropertyTypeName from '@joystream/types/lib/versioned-store/PropertyTypeName';
import { EventData } from '@polkadot/types/type/Event';

import {
  PropertyByNameMap, CreateClassInputType, AddClassSchemaInputType, CreateEntityInputType, AddSchemaSupportToEntityInputType, UpdateEntityPropertyValuesInputType
} from '../types';

import {
  transformCreateClass, transformAddClassSchema, transformCreateEntity,
  transformAddSchemaSupportToEntity, transformUpdateEntityPropertyValues
} from '../transform';

export type KeypairProps = {

  // Example: '//Alice'
  uri: string,

  // Example: 'sr25519'
  type: KeypairType,

  pass?: string
}

export class Substrate {

  protected api: ApiPromise
  
  protected keypair: KeyringPair

  constructor () {}

  public connect = async () => {
    const rpcEndpoint = RpcEndpoints.localhost;
    const provider = new WsProvider(rpcEndpoint);

    // Register types before creating the API:
    registerJoystreamTypes();

    // Create the API and wait until ready:
    console.log(`Connecting to Substrate API: ${rpcEndpoint}`)
    this.api = await ApiPromise.create(provider);

    // Retrieve the chain & node information information via rpc calls
    const system = this.api.rpc.system;
    const [ chain, nodeName, nodeVersion ] = await Promise.all(
      [ system.chain(), system.name(), system.version() ]);

    console.log(`Connected to chain '${chain}' (${nodeName} v${nodeVersion})`)
  }

  public disconnect = () => {
    const { api } = this;
    if (api && api.isReady) {
      api.disconnect();
      console.log(`Disconnect from Substrate API.`);
    }
  }

  /**
   * Shortcut for versioned store query.
   */
  private vsQuery = () => {
    return this.api.query.versionedStore;
  }

  private vsTx = () => {
    return this.api.tx.versionedStore;
  }

  public setKeypair = (props: KeypairProps) => {
    const keyring = new Keyring()

    // TODO allow to import account via JSON file:
    // const keypair = keyring.addFromJson(accountJson)

    // TODO allow to import account via seed.
    // const keypair = keyring.addFromSeed(props.seed, null, props.type)

    const keypair = keyring.addFromUri(props.uri, null, props.type)

    if (keypair.isLocked()) {
      if (props.pass) {
        keypair.decodePkcs8(props.pass);
      } else {
        // TODO (improvement) ask a password to this account in terminal
        throw new Error(`Not implemented: Get an account pass from terminal`)
      }
    }

    console.log(`Next account will be used for signing txs:`,
      {
        address: keypair.address(),
        type: keypair.type
      }
    )

    this.keypair = keypair;
  }

  public accountAddress = () => {
    return this.keypair.address()
  }

  public accountBalance = async () => {
    return await this.api.query.balances.freeBalance(this.accountAddress()) as unknown as BN
  }

  public nextClassId = async () => {
    return await this.vsQuery().nextClassId() as unknown as ClassId
  }

  public nextEntityId = async () => {
    return await this.vsQuery().nextEntityId() as unknown as EntityId
  }

  public getAllClassIds = async (): Promise<ClassId[]> => {
    const nextId = await this.vsQuery().nextClassId() as unknown as ClassId;

    if (!nextId || nextId.lte(new BN(1))) {
      return [];
    }

    const nextIdAsNum = nextId.toNumber();
    const ids: ClassId[] = [];
    for (let i = 1; i < nextIdAsNum; i++) {
      ids.push(new ClassId(i));
    }
    return ids;
  }

  public getAllEntityIds = async (): Promise<EntityId[]> => {
    const nextId = await this.vsQuery().nextEntityId() as unknown as EntityId;

    if (!nextId || nextId.lte(new BN(1))) {
      return [];
    }

    const nextIdAsNum = nextId.toNumber();
    const ids: EntityId[] = [];
    for (let i = 1; i < nextIdAsNum; i++) {
      ids.push(new EntityId(i));
    }
    return ids;
  }

  public getClassById = async (id: ClassId | number): Promise<Class> => {
    return await this.vsQuery().classById(id) as unknown as Class
  }

  public getEntityById = async (id: EntityId | number): Promise<Entity> => {
    return await this.vsQuery().entityById(id) as unknown as Entity
  }
  
  private signTxAndSend = async (tx: SubmittableExtrinsic<CodecResult, SubscriptionResult>, interestingEventName?: string): Promise<EventData | undefined> => {
    
    const balance = await this.accountBalance()
    console.log(`Account balance:`, balance.toString(), 'tokens')
    if (balance.lt(new BN(1))) {
      console.log(`Not enough tokens to execute a tx`)
      return undefined
    }

    // Get the nonce for this account:
    const nonce = await this.api.query.system.accountNonce(this.keypair.address()) as unknown as Uint8Array;

    return await new Promise<EventData>((resolve, reject) => tx
      .sign(this.keypair, { nonce })
      .send(({ events = [], status }) => {
        console.log('Transaction status:', status.type);

        if (status.isFinalized) {
          console.log('Completed at block hash', status.asFinalized.toHex());
          console.log('Events:');

          let eventData: EventData = undefined
          events.forEach(({ phase, event: { data, method, section } }) => {
            console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
            if (interestingEventName && interestingEventName === method) {
              eventData = data
            }
          });

          resolve(eventData)
        }
      }).catch(reject)
    )
  }

  public getClassPropertyMap = async (classId: ClassId): Promise<PropertyByNameMap> => {
    const clazz = await this.getClassById(classId)
    if (!clazz || clazz.id.isZero()) {
      throw new Error(`Class not found by id ${classId.toNumber()}`)
    }

    const map: PropertyByNameMap = new Map();
    clazz.properties.map((prop, index) => {
      const type = prop.prop_type.type as PropertyTypeName
      map.set(prop.name.toString(), { index, type })
    })
    return map
  }

  public txCreateClass = async (input: CreateClassInputType) => {
    const txName = 'testCreateClass'
    const { error, result } = transformCreateClass(input)

    if (error) {
      console.log(`Cannot parse input data for tx '${txName}'`, error)
      return undefined
    }

    const res = await this.signTxAndSend(
      this.vsTx()[txName](
        result.name,
        result.description
      ),
      'ClassCreated'
    )
    console.log(`Tx executed:`, greenItem(txName))
    return res
  }

  public txAddClassSchema = async (input: AddClassSchemaInputType) => {
    const txName = 'testAddClassSchema'

    const classId = new ClassId(input.classId)
    const propMap = await this.getClassPropertyMap(classId)
    const { error, result } = transformAddClassSchema(input, propMap)

    if (error) {
      console.log(`Cannot parse input data for tx '${txName}'`, error)
      return undefined
    }

    const res = await this.signTxAndSend(
      this.vsTx()[txName](
        result.class_id,
        result.existing_properties,
        result.new_properties
      ),
      'ClassSchemaAdded'
    )
    console.log(`Tx executed:`, greenItem(txName))
    return res
  }

  public txCreateEntity = async (input: CreateEntityInputType) => {
    const txName = 'testCreateEntity'
    const { error, result } = transformCreateEntity(input)

    if (error) {
      console.log(`Cannot parse input data for tx '${txName}'`, error)
      return undefined
    }

    const res = await this.signTxAndSend(
      this.vsTx()[txName](
        result.class_id
      ),
      'EntityCreated'
    )
    console.log(`Tx executed:`, greenItem(txName))
    return res
  }

  public txAddSchemaSupportToEntity = async (input: AddSchemaSupportToEntityInputType) => {
    const txName = 'testAddSchemaSupportToEntity'

    const entityId = new EntityId(input.entityId)
    const entity = await this.getEntityById(entityId)
    const propMap = await this.getClassPropertyMap(entity.class_id)
    const { error, result } = transformAddSchemaSupportToEntity(input, propMap)

    if (error) {
      console.log(`Cannot parse input data for tx '${txName}'`, error)
      return undefined
    }

    const res = await this.signTxAndSend(
      this.vsTx()[txName](
        result.entity_id,
        result.schema_id,
        result.property_values
      ),
      'EntitySchemaAdded'
    )
    console.log(`Tx executed:`, greenItem(txName))
    return res
  }

  public txUpdateEntityPropertyValues = async (input: UpdateEntityPropertyValuesInputType) => {
    const txName = 'testUpdateEntityPropertyValues'

    const entityId = new EntityId(input.entityId)
    const entity = await this.getEntityById(entityId)
    const propMap = await this.getClassPropertyMap(entity.class_id)
    const { error, result } = transformUpdateEntityPropertyValues(input, propMap)

    if (error) {
      console.log(`Cannot parse input data for tx '${txName}'`, error)
      return undefined
    }

    const res = await this.signTxAndSend(
      this.vsTx()[txName](
        result.entity_id,
        result.new_property_values
      ),
      'EntityPropertiesUpdated'
    )
    console.log(`Tx executed:`, greenItem(txName))
    return res
  }
}
