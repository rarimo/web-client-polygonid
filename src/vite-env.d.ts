/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_ENVIRONMENT: string
  VITE_PORT: string
  VITE_API_URL: string
  VITE_APP_NAME: string

  VITE_WALLET_CONNECT_PROJECT_ID: string

  VITE_AUTH_BJJ_CREDENTIAL_HASH: string

  VITE_DEMO_VERIFIER_CONTRACT_ADDRESS_POLYGON_TESTNET: string
  VITE_DEMO_SBT_CONTRACT_ADDRESS_POLYGON_TESTNET: string
}

interface Document {
  ENV: ImportMetaEnv
}
