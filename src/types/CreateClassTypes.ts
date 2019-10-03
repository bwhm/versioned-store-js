import { Text } from '@polkadot/types';

export type CreateClassInputType = {
  name: string,
  description: string
}

export type CreateClassOutputType = {
  name: Text,
  description: Text
}
