/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export declare namespace IDemoVerifier {
  export type VerificationInfoStruct = {
    senderAddr: string;
    mintedTokenId: BigNumberish;
  };

  export type VerificationInfoStructOutput = [string, BigNumber] & {
    senderAddr: string;
    mintedTokenId: BigNumber;
  };
}

export declare namespace ICircuitValidator {
  export type CircuitQueryStruct = {
    schema: BigNumberish;
    claimPathKey: BigNumberish;
    operator: BigNumberish;
    value: BigNumberish[];
    queryHash: BigNumberish;
    circuitId: string;
  };

  export type CircuitQueryStructOutput = [
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber[],
    BigNumber,
    string
  ] & {
    schema: BigNumber;
    claimPathKey: BigNumber;
    operator: BigNumber;
    value: BigNumber[];
    queryHash: BigNumber;
    circuitId: string;
  };
}

export interface DemoVerifierInterface extends utils.Interface {
  functions: {
    "AGE_VERIFY_REQUEST_ID()": FunctionFragment;
    "addressToUserId(address)": FunctionFragment;
    "getSupportedRequests()": FunctionFragment;
    "getVerificationInfo(uint256)": FunctionFragment;
    "getZKPRequest(uint64)": FunctionFragment;
    "isUserVerified(uint256)": FunctionFragment;
    "owner()": FunctionFragment;
    "proofs(address,uint64)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "requestQueries(uint64)": FunctionFragment;
    "requestValidators(uint64)": FunctionFragment;
    "sbtContract()": FunctionFragment;
    "setSBTContract(address)": FunctionFragment;
    "setZKPRequest(uint64,address,uint256,uint256,uint256,uint256[])": FunctionFragment;
    "setZKPRequestRaw(uint64,address,uint256,uint256,uint256,uint256[],uint256)": FunctionFragment;
    "submitZKPResponse(uint64,uint256[],uint256[2],uint256[2][2],uint256[2])": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "AGE_VERIFY_REQUEST_ID"
      | "addressToUserId"
      | "getSupportedRequests"
      | "getVerificationInfo"
      | "getZKPRequest"
      | "isUserVerified"
      | "owner"
      | "proofs"
      | "renounceOwnership"
      | "requestQueries"
      | "requestValidators"
      | "sbtContract"
      | "setSBTContract"
      | "setZKPRequest"
      | "setZKPRequestRaw"
      | "submitZKPResponse"
      | "transferOwnership"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "AGE_VERIFY_REQUEST_ID",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "addressToUserId",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getSupportedRequests",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getVerificationInfo",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getZKPRequest",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "isUserVerified",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "proofs",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "requestQueries",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "requestValidators",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "sbtContract",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setSBTContract",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setZKPRequest",
    values: [
      BigNumberish,
      string,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setZKPRequestRaw",
    values: [
      BigNumberish,
      string,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish[],
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "submitZKPResponse",
    values: [
      BigNumberish,
      BigNumberish[],
      [BigNumberish, BigNumberish],
      [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
      [BigNumberish, BigNumberish]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "AGE_VERIFY_REQUEST_ID",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addressToUserId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSupportedRequests",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getVerificationInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getZKPRequest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isUserVerified",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "proofs", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "requestQueries",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "requestValidators",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "sbtContract",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setSBTContract",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setZKPRequest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setZKPRequestRaw",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "submitZKPResponse",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
    "Verified(uint256,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Verified"): EventFragment;
}

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface VerifiedEventObject {
  userId: BigNumber;
  userAddr: string;
  tokenId: BigNumber;
}
export type VerifiedEvent = TypedEvent<
  [BigNumber, string, BigNumber],
  VerifiedEventObject
>;

export type VerifiedEventFilter = TypedEventFilter<VerifiedEvent>;

export interface DemoVerifier extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: DemoVerifierInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    AGE_VERIFY_REQUEST_ID(overrides?: CallOverrides): Promise<[BigNumber]>;

    addressToUserId(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getSupportedRequests(
      overrides?: CallOverrides
    ): Promise<[BigNumber[]] & { arr: BigNumber[] }>;

    getVerificationInfo(
      userId_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[IDemoVerifier.VerificationInfoStructOutput]>;

    getZKPRequest(
      requestId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[ICircuitValidator.CircuitQueryStructOutput]>;

    isUserVerified(
      userId_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    proofs(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    requestQueries(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, string] & {
        schema: BigNumber;
        claimPathKey: BigNumber;
        operator: BigNumber;
        queryHash: BigNumber;
        circuitId: string;
      }
    >;

    requestValidators(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    sbtContract(overrides?: CallOverrides): Promise<[string]>;

    setSBTContract(
      sbtContract_: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    setZKPRequest(
      requestId: BigNumberish,
      validator: string,
      schema: BigNumberish,
      claimPathKey: BigNumberish,
      operator: BigNumberish,
      value: BigNumberish[],
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    setZKPRequestRaw(
      requestId: BigNumberish,
      validator: string,
      schema: BigNumberish,
      claimPathKey: BigNumberish,
      operator: BigNumberish,
      value: BigNumberish[],
      queryHash: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    submitZKPResponse(
      requestId: BigNumberish,
      inputs: BigNumberish[],
      a: [BigNumberish, BigNumberish],
      b: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
      c: [BigNumberish, BigNumberish],
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;
  };

  AGE_VERIFY_REQUEST_ID(overrides?: CallOverrides): Promise<BigNumber>;

  addressToUserId(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  getSupportedRequests(overrides?: CallOverrides): Promise<BigNumber[]>;

  getVerificationInfo(
    userId_: BigNumberish,
    overrides?: CallOverrides
  ): Promise<IDemoVerifier.VerificationInfoStructOutput>;

  getZKPRequest(
    requestId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<ICircuitValidator.CircuitQueryStructOutput>;

  isUserVerified(
    userId_: BigNumberish,
    overrides?: CallOverrides
  ): Promise<boolean>;

  owner(overrides?: CallOverrides): Promise<string>;

  proofs(
    arg0: string,
    arg1: BigNumberish,
    overrides?: CallOverrides
  ): Promise<boolean>;

  renounceOwnership(
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  requestQueries(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber, string] & {
      schema: BigNumber;
      claimPathKey: BigNumber;
      operator: BigNumber;
      queryHash: BigNumber;
      circuitId: string;
    }
  >;

  requestValidators(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  sbtContract(overrides?: CallOverrides): Promise<string>;

  setSBTContract(
    sbtContract_: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  setZKPRequest(
    requestId: BigNumberish,
    validator: string,
    schema: BigNumberish,
    claimPathKey: BigNumberish,
    operator: BigNumberish,
    value: BigNumberish[],
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  setZKPRequestRaw(
    requestId: BigNumberish,
    validator: string,
    schema: BigNumberish,
    claimPathKey: BigNumberish,
    operator: BigNumberish,
    value: BigNumberish[],
    queryHash: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  submitZKPResponse(
    requestId: BigNumberish,
    inputs: BigNumberish[],
    a: [BigNumberish, BigNumberish],
    b: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
    c: [BigNumberish, BigNumberish],
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  callStatic: {
    AGE_VERIFY_REQUEST_ID(overrides?: CallOverrides): Promise<BigNumber>;

    addressToUserId(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getSupportedRequests(overrides?: CallOverrides): Promise<BigNumber[]>;

    getVerificationInfo(
      userId_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<IDemoVerifier.VerificationInfoStructOutput>;

    getZKPRequest(
      requestId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<ICircuitValidator.CircuitQueryStructOutput>;

    isUserVerified(
      userId_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    owner(overrides?: CallOverrides): Promise<string>;

    proofs(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    requestQueries(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, string] & {
        schema: BigNumber;
        claimPathKey: BigNumber;
        operator: BigNumber;
        queryHash: BigNumber;
        circuitId: string;
      }
    >;

    requestValidators(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    sbtContract(overrides?: CallOverrides): Promise<string>;

    setSBTContract(
      sbtContract_: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setZKPRequest(
      requestId: BigNumberish,
      validator: string,
      schema: BigNumberish,
      claimPathKey: BigNumberish,
      operator: BigNumberish,
      value: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<boolean>;

    setZKPRequestRaw(
      requestId: BigNumberish,
      validator: string,
      schema: BigNumberish,
      claimPathKey: BigNumberish,
      operator: BigNumberish,
      value: BigNumberish[],
      queryHash: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    submitZKPResponse(
      requestId: BigNumberish,
      inputs: BigNumberish[],
      a: [BigNumberish, BigNumberish],
      b: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
      c: [BigNumberish, BigNumberish],
      overrides?: CallOverrides
    ): Promise<boolean>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;

    "Verified(uint256,address,uint256)"(
      userId?: BigNumberish | null,
      userAddr?: string | null,
      tokenId?: null
    ): VerifiedEventFilter;
    Verified(
      userId?: BigNumberish | null,
      userAddr?: string | null,
      tokenId?: null
    ): VerifiedEventFilter;
  };

  estimateGas: {
    AGE_VERIFY_REQUEST_ID(overrides?: CallOverrides): Promise<BigNumber>;

    addressToUserId(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getSupportedRequests(overrides?: CallOverrides): Promise<BigNumber>;

    getVerificationInfo(
      userId_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getZKPRequest(
      requestId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isUserVerified(
      userId_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    proofs(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    requestQueries(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    requestValidators(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    sbtContract(overrides?: CallOverrides): Promise<BigNumber>;

    setSBTContract(
      sbtContract_: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    setZKPRequest(
      requestId: BigNumberish,
      validator: string,
      schema: BigNumberish,
      claimPathKey: BigNumberish,
      operator: BigNumberish,
      value: BigNumberish[],
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    setZKPRequestRaw(
      requestId: BigNumberish,
      validator: string,
      schema: BigNumberish,
      claimPathKey: BigNumberish,
      operator: BigNumberish,
      value: BigNumberish[],
      queryHash: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    submitZKPResponse(
      requestId: BigNumberish,
      inputs: BigNumberish[],
      a: [BigNumberish, BigNumberish],
      b: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
      c: [BigNumberish, BigNumberish],
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    AGE_VERIFY_REQUEST_ID(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    addressToUserId(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getSupportedRequests(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getVerificationInfo(
      userId_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getZKPRequest(
      requestId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isUserVerified(
      userId_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    proofs(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    requestQueries(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    requestValidators(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    sbtContract(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setSBTContract(
      sbtContract_: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    setZKPRequest(
      requestId: BigNumberish,
      validator: string,
      schema: BigNumberish,
      claimPathKey: BigNumberish,
      operator: BigNumberish,
      value: BigNumberish[],
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    setZKPRequestRaw(
      requestId: BigNumberish,
      validator: string,
      schema: BigNumberish,
      claimPathKey: BigNumberish,
      operator: BigNumberish,
      value: BigNumberish[],
      queryHash: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    submitZKPResponse(
      requestId: BigNumberish,
      inputs: BigNumberish[],
      a: [BigNumberish, BigNumberish],
      b: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
      c: [BigNumberish, BigNumberish],
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;
  };
}
