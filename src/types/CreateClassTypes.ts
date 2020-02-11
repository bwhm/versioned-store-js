import { Text } from '@polkadot/types';

export type CreateClassInputType = {
  name: string,
  description: string,
  channel_owners_can_create_entity?: boolean
}

export type CreateClassOutputType = {
  name: Text,
  description: Text
}
