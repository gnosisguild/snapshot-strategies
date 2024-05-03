import fetch from 'cross-fetch';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { Strategy } from '@snapshot-labs/snapshot.js/dist/voting/types';

export const author = 'gnosisguild';
export const version = '1.0.0';

const DEFAULT_BACKEND_URL = 'https://delegate-api.gnosisguild.org';

type Params = {
  backendUrl: string;
  strategies: Strategy[];
  totalSupply: string | number;
};

export async function strategy(
  space: string,
  network: string,
  provider: StaticJsonRpcProvider,
  addresses: string[],
  options: Params = {
    backendUrl: DEFAULT_BACKEND_URL,
    strategies: [],
    totalSupply: 0
  },
  snapshot: string | number
): Promise<Record<string, number>> {
  const blockTag = typeof snapshot === 'number' ? snapshot : 'latest';

  if (options.strategies.length > 8)
    throw new Error('Maximum 8 strategies allowed');

  const response = await fetch(
    `${options.backendUrl}/api/v1/${space}/${blockTag}/voting-power`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        options: {
          strategies: options.strategies,
          network: Number(network)
        },
        addresses
      })
    }
  );

  const votingPowerByAddress = (await response.json()) as {
    [k: string]: number;
  };

  return votingPowerByAddress;
}
