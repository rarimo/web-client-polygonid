import { Chain, CHAIN_TYPES } from '@distributedlab/w3p'
import mapKeys from 'lodash/mapKeys'
import pickBy from 'lodash/pickBy'
import { LogLevelDesc } from 'loglevel'

import packageJson from '../package.json'

export enum SUPPORTED_CHAINS {
  MAINNET = 'MAINNET',
  SEPOLIA = 'SEPOLIA',
  POLYGON = 'POLYGON',
  POLYGON_TESTNET = 'POLYGON_TESTNET',
}

export const SUPPORTED_CHAINS_DETAILS: Record<SUPPORTED_CHAINS, Chain> = {
  [SUPPORTED_CHAINS.MAINNET]: {
    id: '1',
    name: 'Ethereum',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    explorerUrl: 'https://etherscan.io',
    token: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    type: CHAIN_TYPES.EVM,
    icon: '',
  },
  [SUPPORTED_CHAINS.SEPOLIA]: {
    id: '11155111',
    name: 'Sepolia',
    rpcUrl: 'https://endpoints.omniatech.io/v1/eth/sepolia/public',
    explorerUrl: 'https://sepolia.etherscan.io',
    token: {
      name: 'Sepolia',
      symbol: 'Sepolia',
      decimals: 18,
    },
    type: CHAIN_TYPES.EVM,
    icon: '',
  },
  // FIXME: use the correct chain details for polygon
  [SUPPORTED_CHAINS.POLYGON]: {
    id: '137',
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com/',
    explorerUrl: 'https://polygonscan.com/',
    token: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    type: CHAIN_TYPES.EVM,
    icon: '',
  },
  [SUPPORTED_CHAINS.POLYGON_TESTNET]: {
    id: '80001',
    name: 'Mumbai',
    rpcUrl: 'https://endpoints.omniatech.io/v1/matic/mumbai/public',
    explorerUrl: 'https://mumbai.polygonscan.com/',
    token: {
      name: 'Matic',
      symbol: 'Matic',
      decimals: 18,
    },
    type: CHAIN_TYPES.EVM,
    icon: '',
  },
}

export const config = {
  API_URL: import.meta.env.VITE_API_URL,
  APP_NAME: import.meta.env.VITE_APP_NAME,
  LOG_LEVEL: 'trace' as LogLevelDesc,
  BUILD_VERSION: packageJson.version || import.meta.env.VITE_APP_BUILD_VERSION,

  WALLET_CONNECT_PROJECT_ID: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
  AUTH_BJJ_CREDENTIAL_HASH: import.meta.env.VITE_AUTH_BJJ_CREDENTIAL_HASH,
  REQUEST_BUILD_SENDER: import.meta.env.VITE_REQUEST_BUILD_SENDER,

  ...(Object.values(SUPPORTED_CHAINS).reduce(
    (acc, curr) => ({
      ...acc,
      /* eslint-disable max-len */
      /* prettier-ignore */
      [`QUERY_VERIFIER_CONTRACT_ADDRESS_${curr}`]: import.meta.env[`VITE_QUERY_VERIFIER_CONTRACT_ADDRESS_${curr}`] || '',
      /* prettier-ignore */
      [`VERIFIED_SBT_CONTRACT_ADDRESS_${curr}`]: import.meta.env[`VITE_VERIFIED_SBT_CONTRACT_ADDRESS_${curr}`] || '',
    }),
    {},
  ) as {
    [k in
      | `QUERY_VERIFIER_CONTRACT_ADDRESS_${SUPPORTED_CHAINS}`
      | `VERIFIED_SBT_CONTRACT_ADDRESS_${SUPPORTED_CHAINS}`]: string
  }),

  CALLBACK_URL: import.meta.env.VITE_CALLBACK_URL,

  DEFAULT_CHAIN: import.meta.env.VITE_DEFAULT_CHAIN as SUPPORTED_CHAINS,

  /* eslint-enable */
} as const

Object.assign(config, _mapEnvCfg(import.meta.env))
Object.assign(config, _mapEnvCfg(window.document.ENV))

function _mapEnvCfg(env: ImportMetaEnv | typeof window.document.ENV): {
  [k: string]: string | boolean | undefined
} {
  return mapKeys(
    pickBy(env, (v, k) => k.startsWith('VITE_APP_')),
    (v, k) => k.replace(/^VITE_APP_/, ''),
  )
}
