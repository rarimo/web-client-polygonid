import { config, DEFAULT_CHAIN, SUPPORTED_CHAINS_DETAILS } from '@config'
import { DECIMALS } from '@distributedlab/tools'
import {
  Chain,
  CHAIN_TYPES,
  ChainId,
  EthTransactionResponse,
  getEthExplorerAddressUrl,
  getEthExplorerTxUrl,
  PROVIDER_EVENT_BUS_EVENTS,
  PROVIDER_EVENTS,
  ProviderEventBus,
  ProviderProxy,
  RawProvider,
  SolanaTransactionResponse,
  TransactionResponse,
  TxRequestBody,
} from '@distributedlab/w3p'
import { EthereumProvider } from '@walletconnect/ethereum-provider'
import { providers, utils } from 'ethers'

import { EXTERNAL_PROVIDERS } from '@/contexts/Web3ProviderContext/enums'

export class WalletConnectEvmProvider
  extends ProviderEventBus
  implements ProviderProxy
{
  #provider: InstanceType<typeof EthereumProvider>
  #ethProvider?: providers.Web3Provider

  #chainId?: ChainId
  #address?: string

  constructor(provider: RawProvider) {
    super()

    this.#provider = provider as unknown as InstanceType<
      typeof EthereumProvider
    >
  }

  static get providerType(): string {
    return EXTERNAL_PROVIDERS.WalletConnect
  }

  get rawProvider() {
    return this.#ethProvider as unknown as RawProvider
  }

  get chainType(): CHAIN_TYPES {
    return CHAIN_TYPES.EVM
  }

  get isConnected(): boolean {
    return Boolean(this.#chainId)
  }

  get chainId(): ChainId | undefined {
    return this.#chainId
  }

  get address(): string | undefined {
    return this.#address
  }

  get #defaultEventPayload() {
    return {
      address: this.#address,
      chainId: this.#chainId,
      isConnected: this.isConnected,
    }
  }

  async init(): Promise<void> {
    this.#provider = await EthereumProvider.init({
      projectId: config.WALLET_CONNECT_PROJECT_ID,
      chains: [Number(SUPPORTED_CHAINS_DETAILS[DEFAULT_CHAIN].id)],
      optionalChains: Object.values(SUPPORTED_CHAINS_DETAILS).map(el =>
        Number(el.id),
      ),
      showQrModal: true,
      methods: [
        'wallet_switchEthereumChain',
        'wallet_addEthereumChain',
        'eth_requestAccounts',

        'eth_sendTransaction',

        'eth_sign',
        'personal_sign',
        'eth_signTypedData',
      ],
      events: [
        PROVIDER_EVENTS.Connect,
        PROVIDER_EVENTS.Disconnect,
        PROVIDER_EVENTS.ChainChanged,
        PROVIDER_EVENTS.AccountsChanged,
      ],
      optionalEvents: [],
    })
    this.#ethProvider = new providers.Web3Provider(
      this.#provider as unknown as providers.ExternalProvider,
    )

    await this.#checkForPersistedSession()

    await this.#setListeners()

    this.emit(PROVIDER_EVENT_BUS_EVENTS.Initiated, this.#defaultEventPayload)
  }

  async connect(): Promise<void> {
    await this.#provider.connect()

    await this.#provider.enable()

    const accounts = await this.#provider.request<string[]>({
      method: 'eth_requestAccounts',
    })

    this.#chainId =
      this.#provider?.session?.namespaces?.eip155?.chains?.[0]?.split(':')[1]

    this.#address = accounts?.[0]

    this.emit(
      PROVIDER_EVENT_BUS_EVENTS.AccountChanged,
      this.#defaultEventPayload,
    )
    this.emit(
      this.isConnected
        ? PROVIDER_EVENT_BUS_EVENTS.Connect
        : PROVIDER_EVENT_BUS_EVENTS.Disconnect,
      this.#defaultEventPayload,
    )
  }

  async #checkForPersistedSession() {
    if (typeof this.#provider === 'undefined') {
      throw new Error('WalletConnect is not initialized')
    }

    if (this.#provider?.session) {
      const _session = this.#provider?.session

      if (!this.#provider) {
        throw new ReferenceError('EthereumProvider is not initialized.')
      }

      this.#ethProvider = new providers.Web3Provider(
        this.#provider as unknown as providers.ExternalProvider,
      )

      this.#chainId =
        this.#provider?.session?.namespaces?.eip155?.chains?.[0]?.split(':')[1]

      this.#address =
        this.#provider?.session?.namespaces?.eip155?.accounts?.[0]?.split(
          ':',
        )?.[2]

      return _session
    }
  }

  getAddressUrl(chain: Chain, address: string): string {
    return getEthExplorerAddressUrl(chain, address)
  }

  getTxUrl(chain: Chain, txHash: string): string {
    return getEthExplorerTxUrl(chain, txHash)
  }

  getHashFromTx(txResponse: TransactionResponse): string {
    return (txResponse as EthTransactionResponse)
      .transactionHash as SolanaTransactionResponse
  }

  // FIXME: can't call it more than once
  async switchChain(chainId: ChainId): Promise<void> {
    await this.#ethProvider?.send?.('wallet_switchEthereumChain', [
      { chainId: utils.hexlify(chainId) },
    ])
  }

  async addChain(chain: Chain): Promise<void> {
    await this.#ethProvider?.send?.('wallet_addEthereumChain', [
      {
        chainId: utils.hexValue(Number(chain.id)),
        chainName: chain.name,
        ...(chain.token.name &&
          chain.token.symbol && {
            nativeCurrency: {
              name: chain.token.name,
              symbol: chain.token.symbol,
              decimals: chain.token.decimals ?? DECIMALS.WEI,
            },
          }),
        rpcUrls: [chain.rpcUrl],
        blockExplorerUrls: [...(chain.explorerUrl ? [chain.explorerUrl] : [])],
        ...(chain.icon && { iconUrls: [chain.icon] }),
      },
    ])
  }

  async signAndSendTx(tx: TxRequestBody): Promise<TransactionResponse> {
    if (!this.#provider) throw new TypeError(`Provider is not initialized`)

    this.emit(PROVIDER_EVENT_BUS_EVENTS.BeforeTxSent, {
      txBody: tx,
    })

    const transactionResponse = await (
      this.rawProvider as unknown as InstanceType<typeof providers.Web3Provider>
    ).send('eth_sendTransaction', [tx])

    // const transactionResponse =
    //   await this.#provider?.request<providers.TransactionResponse>({
    //     method: 'eth_sendTransaction',
    //     params: [tx],
    //   })

    console.log(transactionResponse)

    this.emit(PROVIDER_EVENT_BUS_EVENTS.TxSent, {
      txHash: transactionResponse?.hash,
    })

    const receipt = await transactionResponse?.wait()

    this.emit(PROVIDER_EVENT_BUS_EVENTS.TxConfirmed, {
      txResponse: receipt,
    })

    return receipt
  }

  async signMessage(message: string): Promise<string> {
    if (!this.#provider || !this.#address)
      throw new TypeError(`Provider is not initialized`)

    return (
      this.rawProvider as unknown as InstanceType<typeof providers.Web3Provider>
    ).send('personal_sign', [
      utils.hexlify(utils.toUtf8Bytes(message)),
      this.#address.toLowerCase(),
    ])

    // return this.#provider.request({
    //   method: 'personal_sign',
    //   params: [
    //     utils.hexlify(utils.toUtf8Bytes(message)),
    //     this.#address.toLowerCase(),
    //   ],
    // })
  }

  async #setListeners() {
    this.#provider.on('session_event', e => {
      this.#chainId = e?.params?.chainId.split(':')[1] ?? this.#chainId

      this.#address =
        e?.params?.event?.data?.[0]?.split(':')?.[2] ?? this.#address

      this.emit(
        PROVIDER_EVENT_BUS_EVENTS.AccountChanged,
        this.#defaultEventPayload,
      )
      this.emit(
        PROVIDER_EVENT_BUS_EVENTS.ChainChanged,
        this.#defaultEventPayload,
      )
      this.emit(
        this.isConnected
          ? PROVIDER_EVENT_BUS_EVENTS.Connect
          : PROVIDER_EVENT_BUS_EVENTS.Disconnect,
        this.#defaultEventPayload,
      )
    })

    this.#provider.on('session_update', ({ id, topic }) => {
      /* empty */
    })

    this.#provider.on('session_delete', () => {
      this.emit(PROVIDER_EVENT_BUS_EVENTS.Disconnect, this.#defaultEventPayload)
    })
  }
}
