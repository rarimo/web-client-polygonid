import type { Chain } from '@distributedlab/w3p'
import mapKeys from 'lodash/mapKeys'
import pickBy from 'lodash/pickBy'
import { LogLevelDesc } from 'loglevel'

import FALLBACK_SUPPORTED_CHAINS from '@/assets/fallback-supported-chains.json'

import packageJson from '../package.json'

export type SUPPORTED_CHAINS = keyof typeof FALLBACK_SUPPORTED_CHAINS

type ContractAddresses = {
  [k in
    | `QUERY_VERIFIER_CONTRACT_ADDRESS_${SUPPORTED_CHAINS}`
    | `VERIFIED_SBT_CONTRACT_ADDRESS_${SUPPORTED_CHAINS}`]: string
}

export const config = {
  API_URL: import.meta.env.VITE_API_URL,
  APP_NAME: import.meta.env.VITE_APP_NAME,
  LOG_LEVEL: 'trace' as LogLevelDesc,
  BUILD_VERSION: packageJson.version || import.meta.env.VITE_APP_BUILD_VERSION,

  WALLET_CONNECT_PROJECT_ID: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
  AUTH_BJJ_CREDENTIAL_HASH: import.meta.env.VITE_AUTH_BJJ_CREDENTIAL_HASH,
  REQUEST_BUILD_SENDER: import.meta.env.VITE_REQUEST_BUILD_SENDER,

  SUPPORTED_CHAINS_DETAILS: (import.meta.env.VITE_SUPPORTED_CHAINS_DETAILS
    ? JSON.parse(import.meta.env.VITE_SUPPORTED_CHAINS_DETAILS)
    : FALLBACK_SUPPORTED_CHAINS) as Record<
    keyof typeof FALLBACK_SUPPORTED_CHAINS,
    Chain
  >,

  CALLBACK_URL: import.meta.env.VITE_CALLBACK_URL,

  DEFAULT_CHAIN: import.meta.env.VITE_DEFAULT_CHAIN as SUPPORTED_CHAINS,

  /* eslint-enable */
} as {
  API_URL: string
  APP_NAME: string
  LOG_LEVEL: string
  BUILD_VERSION: string
  WALLET_CONNECT_PROJECT_ID: string
  AUTH_BJJ_CREDENTIAL_HASH: string
  REQUEST_BUILD_SENDER: string

  SUPPORTED_CHAINS_DETAILS: Record<
    keyof typeof FALLBACK_SUPPORTED_CHAINS,
    Chain
  >

  CALLBACK_URL: string
  DEFAULT_CHAIN: SUPPORTED_CHAINS
} & Partial<ContractAddresses>

Object.assign(config, _mapEnvCfg(import.meta.env))
Object.assign(config, _mapEnvCfg(window.document.ENV))

Object.assign(config, {
  ...(Object.keys(config.SUPPORTED_CHAINS_DETAILS).reduce(
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
})

function _mapEnvCfg(env: ImportMetaEnv | typeof window.document.ENV): {
  [k: string]: string | boolean | undefined
} {
  return mapKeys(
    pickBy(env, (v, k) => k.startsWith('VITE_APP_')),
    (v, k) => k.replace(/^VITE_APP_/, ''),
  )
}
