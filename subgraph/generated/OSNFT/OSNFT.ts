// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class ApprovalForAll extends ethereum.Event {
  get params(): ApprovalForAll__Params {
    return new ApprovalForAll__Params(this);
  }
}

export class ApprovalForAll__Params {
  _event: ApprovalForAll;

  constructor(event: ApprovalForAll) {
    this._event = event;
  }

  get account(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get operator(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get approved(): boolean {
    return this._event.parameters[2].value.toBoolean();
  }
}

export class Initialized extends ethereum.Event {
  get params(): Initialized__Params {
    return new Initialized__Params(this);
  }
}

export class Initialized__Params {
  _event: Initialized;

  constructor(event: Initialized) {
    this._event = event;
  }

  get version(): i32 {
    return this._event.parameters[0].value.toI32();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class ProjectTokenize extends ethereum.Event {
  get params(): ProjectTokenize__Params {
    return new ProjectTokenize__Params(this);
  }
}

export class ProjectTokenize__Params {
  _event: ProjectTokenize;

  constructor(event: ProjectTokenize) {
    this._event = event;
  }

  get tokenId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get creator(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get basePrice(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get popularityFactorPrice(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get paymentToken(): Address {
    return this._event.parameters[4].value.toAddress();
  }

  get royality(): i32 {
    return this._event.parameters[5].value.toI32();
  }

  get projectUrl(): string {
    return this._event.parameters[6].value.toString();
  }
}

export class TokenMint extends ethereum.Event {
  get params(): TokenMint__Params {
    return new TokenMint__Params(this);
  }
}

export class TokenMint__Params {
  _event: TokenMint;

  constructor(event: TokenMint) {
    this._event = event;
  }

  get star(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get fork(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get mintPrice(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class TransferBatch extends ethereum.Event {
  get params(): TransferBatch__Params {
    return new TransferBatch__Params(this);
  }
}

export class TransferBatch__Params {
  _event: TransferBatch;

  constructor(event: TransferBatch) {
    this._event = event;
  }

  get operator(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get from(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get to(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get ids(): Array<BigInt> {
    return this._event.parameters[3].value.toBigIntArray();
  }

  get values(): Array<BigInt> {
    return this._event.parameters[4].value.toBigIntArray();
  }
}

export class TransferSingle extends ethereum.Event {
  get params(): TransferSingle__Params {
    return new TransferSingle__Params(this);
  }
}

export class TransferSingle__Params {
  _event: TransferSingle;

  constructor(event: TransferSingle) {
    this._event = event;
  }

  get operator(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get from(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get to(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get id(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get value(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }
}

export class URI extends ethereum.Event {
  get params(): URI__Params {
    return new URI__Params(this);
  }
}

export class URI__Params {
  _event: URI;

  constructor(event: URI) {
    this._event = event;
  }

  get value(): string {
    return this._event.parameters[0].value.toString();
  }

  get id(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class VerifierAdded extends ethereum.Event {
  get params(): VerifierAdded__Params {
    return new VerifierAdded__Params(this);
  }
}

export class VerifierAdded__Params {
  _event: VerifierAdded;

  constructor(event: VerifierAdded) {
    this._event = event;
  }

  get account(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class VerifierRemoved extends ethereum.Event {
  get params(): VerifierRemoved__Params {
    return new VerifierRemoved__Params(this);
  }
}

export class VerifierRemoved__Params {
  _event: VerifierRemoved;

  constructor(event: VerifierRemoved) {
    this._event = event;
  }

  get account(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class OSNFT__getProjectResultValue0Struct extends ethereum.Tuple {
  get basePrice(): BigInt {
    return this[0].toBigInt();
  }

  get creator(): Address {
    return this[1].toAddress();
  }

  get paymentERC20Token(): Address {
    return this[2].toAddress();
  }

  get popularityFactorPrice(): BigInt {
    return this[3].toBigInt();
  }

  get lastMintPrice(): BigInt {
    return this[4].toBigInt();
  }

  get royality(): i32 {
    return this[5].toI32();
  }

  get tokenCount(): BigInt {
    return this[6].toBigInt();
  }

  get treasuryTotalAmount(): BigInt {
    return this[7].toBigInt();
  }
}

export class OSNFT extends ethereum.SmartContract {
  static bind(address: Address): OSNFT {
    return new OSNFT("OSNFT", address);
  }

  balanceOf(account: Address, id: BigInt): BigInt {
    let result = super.call(
      "balanceOf",
      "balanceOf(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(account),
        ethereum.Value.fromUnsignedBigInt(id)
      ]
    );

    return result[0].toBigInt();
  }

  try_balanceOf(account: Address, id: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "balanceOf",
      "balanceOf(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(account),
        ethereum.Value.fromUnsignedBigInt(id)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  balanceOfBatch(accounts: Array<Address>, ids: Array<BigInt>): Array<BigInt> {
    let result = super.call(
      "balanceOfBatch",
      "balanceOfBatch(address[],uint256[]):(uint256[])",
      [
        ethereum.Value.fromAddressArray(accounts),
        ethereum.Value.fromUnsignedBigIntArray(ids)
      ]
    );

    return result[0].toBigIntArray();
  }

  try_balanceOfBatch(
    accounts: Array<Address>,
    ids: Array<BigInt>
  ): ethereum.CallResult<Array<BigInt>> {
    let result = super.tryCall(
      "balanceOfBatch",
      "balanceOfBatch(address[],uint256[]):(uint256[])",
      [
        ethereum.Value.fromAddressArray(accounts),
        ethereum.Value.fromUnsignedBigIntArray(ids)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigIntArray());
  }

  getContractEarning(paymentToken: Address): BigInt {
    let result = super.call(
      "getContractEarning",
      "getContractEarning(address):(uint256)",
      [ethereum.Value.fromAddress(paymentToken)]
    );

    return result[0].toBigInt();
  }

  try_getContractEarning(paymentToken: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getContractEarning",
      "getContractEarning(address):(uint256)",
      [ethereum.Value.fromAddress(paymentToken)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getInvestedAmount(tokenId: BigInt, owner: Address): BigInt {
    let result = super.call(
      "getInvestedAmount",
      "getInvestedAmount(uint256,address):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(tokenId),
        ethereum.Value.fromAddress(owner)
      ]
    );

    return result[0].toBigInt();
  }

  try_getInvestedAmount(
    tokenId: BigInt,
    owner: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getInvestedAmount",
      "getInvestedAmount(uint256,address):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(tokenId),
        ethereum.Value.fromAddress(owner)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getProject(tokenId: BigInt): OSNFT__getProjectResultValue0Struct {
    let result = super.call(
      "getProject",
      "getProject(uint256):((uint256,address,address,uint256,uint256,uint8,uint256,uint256))",
      [ethereum.Value.fromUnsignedBigInt(tokenId)]
    );

    return changetype<OSNFT__getProjectResultValue0Struct>(result[0].toTuple());
  }

  try_getProject(
    tokenId: BigInt
  ): ethereum.CallResult<OSNFT__getProjectResultValue0Struct> {
    let result = super.tryCall(
      "getProject",
      "getProject(uint256):((uint256,address,address,uint256,uint256,uint8,uint256,uint256))",
      [ethereum.Value.fromUnsignedBigInt(tokenId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      changetype<OSNFT__getProjectResultValue0Struct>(value[0].toTuple())
    );
  }

  isApprovedForAll(account: Address, operator: Address): boolean {
    let result = super.call(
      "isApprovedForAll",
      "isApprovedForAll(address,address):(bool)",
      [
        ethereum.Value.fromAddress(account),
        ethereum.Value.fromAddress(operator)
      ]
    );

    return result[0].toBoolean();
  }

  try_isApprovedForAll(
    account: Address,
    operator: Address
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isApprovedForAll",
      "isApprovedForAll(address,address):(bool)",
      [
        ethereum.Value.fromAddress(account),
        ethereum.Value.fromAddress(operator)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  isPayableToken(token: Address): boolean {
    let result = super.call(
      "isPayableToken",
      "isPayableToken(address):(bool)",
      [ethereum.Value.fromAddress(token)]
    );

    return result[0].toBoolean();
  }

  try_isPayableToken(token: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isPayableToken",
      "isPayableToken(address):(bool)",
      [ethereum.Value.fromAddress(token)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  isVerifier(account: Address): boolean {
    let result = super.call("isVerifier", "isVerifier(address):(bool)", [
      ethereum.Value.fromAddress(account)
    ]);

    return result[0].toBoolean();
  }

  try_isVerifier(account: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall("isVerifier", "isVerifier(address):(bool)", [
      ethereum.Value.fromAddress(account)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  mintPrice(tokenId: BigInt, star: BigInt, fork: BigInt): BigInt {
    let result = super.call(
      "mintPrice",
      "mintPrice(uint256,uint256,uint256):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(tokenId),
        ethereum.Value.fromUnsignedBigInt(star),
        ethereum.Value.fromUnsignedBigInt(fork)
      ]
    );

    return result[0].toBigInt();
  }

  try_mintPrice(
    tokenId: BigInt,
    star: BigInt,
    fork: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "mintPrice",
      "mintPrice(uint256,uint256,uint256):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(tokenId),
        ethereum.Value.fromUnsignedBigInt(star),
        ethereum.Value.fromUnsignedBigInt(fork)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  supportsInterface(interfaceId: Bytes): boolean {
    let result = super.call(
      "supportsInterface",
      "supportsInterface(bytes4):(bool)",
      [ethereum.Value.fromFixedBytes(interfaceId)]
    );

    return result[0].toBoolean();
  }

  try_supportsInterface(interfaceId: Bytes): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "supportsInterface",
      "supportsInterface(bytes4):(bool)",
      [ethereum.Value.fromFixedBytes(interfaceId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  uri(param0: BigInt): string {
    let result = super.call("uri", "uri(uint256):(string)", [
      ethereum.Value.fromUnsignedBigInt(param0)
    ]);

    return result[0].toString();
  }

  try_uri(param0: BigInt): ethereum.CallResult<string> {
    let result = super.tryCall("uri", "uri(uint256):(string)", [
      ethereum.Value.fromUnsignedBigInt(param0)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }
}

export class AddPayableTokensCall extends ethereum.Call {
  get inputs(): AddPayableTokensCall__Inputs {
    return new AddPayableTokensCall__Inputs(this);
  }

  get outputs(): AddPayableTokensCall__Outputs {
    return new AddPayableTokensCall__Outputs(this);
  }
}

export class AddPayableTokensCall__Inputs {
  _call: AddPayableTokensCall;

  constructor(call: AddPayableTokensCall) {
    this._call = call;
  }

  get tokens(): Array<Address> {
    return this._call.inputValues[0].value.toAddressArray();
  }
}

export class AddPayableTokensCall__Outputs {
  _call: AddPayableTokensCall;

  constructor(call: AddPayableTokensCall) {
    this._call = call;
  }
}

export class AddVerifierCall extends ethereum.Call {
  get inputs(): AddVerifierCall__Inputs {
    return new AddVerifierCall__Inputs(this);
  }

  get outputs(): AddVerifierCall__Outputs {
    return new AddVerifierCall__Outputs(this);
  }
}

export class AddVerifierCall__Inputs {
  _call: AddVerifierCall;

  constructor(call: AddVerifierCall) {
    this._call = call;
  }

  get account(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class AddVerifierCall__Outputs {
  _call: AddVerifierCall;

  constructor(call: AddVerifierCall) {
    this._call = call;
  }
}

export class BurnCall extends ethereum.Call {
  get inputs(): BurnCall__Inputs {
    return new BurnCall__Inputs(this);
  }

  get outputs(): BurnCall__Outputs {
    return new BurnCall__Outputs(this);
  }
}

export class BurnCall__Inputs {
  _call: BurnCall;

  constructor(call: BurnCall) {
    this._call = call;
  }

  get tokenId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class BurnCall__Outputs {
  _call: BurnCall;

  constructor(call: BurnCall) {
    this._call = call;
  }
}

export class InitializeCall extends ethereum.Call {
  get inputs(): InitializeCall__Inputs {
    return new InitializeCall__Inputs(this);
  }

  get outputs(): InitializeCall__Outputs {
    return new InitializeCall__Outputs(this);
  }
}

export class InitializeCall__Inputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }

  get uri_(): string {
    return this._call.inputValues[0].value.toString();
  }
}

export class InitializeCall__Outputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }
}

export class MintToCall extends ethereum.Call {
  get inputs(): MintToCall__Inputs {
    return new MintToCall__Inputs(this);
  }

  get outputs(): MintToCall__Outputs {
    return new MintToCall__Outputs(this);
  }
}

export class MintToCall__Inputs {
  _call: MintToCall;

  constructor(call: MintToCall) {
    this._call = call;
  }

  get tokenId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get star(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get fork(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get verifierSignatureData(): MintToCallVerifierSignatureDataStruct {
    return changetype<MintToCallVerifierSignatureDataStruct>(
      this._call.inputValues[3].value.toTuple()
    );
  }
}

export class MintToCall__Outputs {
  _call: MintToCall;

  constructor(call: MintToCall) {
    this._call = call;
  }
}

export class MintToCallVerifierSignatureDataStruct extends ethereum.Tuple {
  get signature(): Bytes {
    return this[0].toBytes();
  }

  get validUntil(): BigInt {
    return this[1].toBigInt();
  }

  get to(): Address {
    return this[2].toAddress();
  }
}

export class RemovePayableTokenCall extends ethereum.Call {
  get inputs(): RemovePayableTokenCall__Inputs {
    return new RemovePayableTokenCall__Inputs(this);
  }

  get outputs(): RemovePayableTokenCall__Outputs {
    return new RemovePayableTokenCall__Outputs(this);
  }
}

export class RemovePayableTokenCall__Inputs {
  _call: RemovePayableTokenCall;

  constructor(call: RemovePayableTokenCall) {
    this._call = call;
  }

  get token(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class RemovePayableTokenCall__Outputs {
  _call: RemovePayableTokenCall;

  constructor(call: RemovePayableTokenCall) {
    this._call = call;
  }
}

export class RemoveVerifierCall extends ethereum.Call {
  get inputs(): RemoveVerifierCall__Inputs {
    return new RemoveVerifierCall__Inputs(this);
  }

  get outputs(): RemoveVerifierCall__Outputs {
    return new RemoveVerifierCall__Outputs(this);
  }
}

export class RemoveVerifierCall__Inputs {
  _call: RemoveVerifierCall;

  constructor(call: RemoveVerifierCall) {
    this._call = call;
  }

  get account(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class RemoveVerifierCall__Outputs {
  _call: RemoveVerifierCall;

  constructor(call: RemoveVerifierCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class SafeBatchTransferFromCall extends ethereum.Call {
  get inputs(): SafeBatchTransferFromCall__Inputs {
    return new SafeBatchTransferFromCall__Inputs(this);
  }

  get outputs(): SafeBatchTransferFromCall__Outputs {
    return new SafeBatchTransferFromCall__Outputs(this);
  }
}

export class SafeBatchTransferFromCall__Inputs {
  _call: SafeBatchTransferFromCall;

  constructor(call: SafeBatchTransferFromCall) {
    this._call = call;
  }

  get from(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get to(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get ids(): Array<BigInt> {
    return this._call.inputValues[2].value.toBigIntArray();
  }

  get amounts(): Array<BigInt> {
    return this._call.inputValues[3].value.toBigIntArray();
  }

  get data(): Bytes {
    return this._call.inputValues[4].value.toBytes();
  }
}

export class SafeBatchTransferFromCall__Outputs {
  _call: SafeBatchTransferFromCall;

  constructor(call: SafeBatchTransferFromCall) {
    this._call = call;
  }
}

export class SafeTransferFromCall extends ethereum.Call {
  get inputs(): SafeTransferFromCall__Inputs {
    return new SafeTransferFromCall__Inputs(this);
  }

  get outputs(): SafeTransferFromCall__Outputs {
    return new SafeTransferFromCall__Outputs(this);
  }
}

export class SafeTransferFromCall__Inputs {
  _call: SafeTransferFromCall;

  constructor(call: SafeTransferFromCall) {
    this._call = call;
  }

  get from(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get to(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get id(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get amount(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get data(): Bytes {
    return this._call.inputValues[4].value.toBytes();
  }
}

export class SafeTransferFromCall__Outputs {
  _call: SafeTransferFromCall;

  constructor(call: SafeTransferFromCall) {
    this._call = call;
  }
}

export class SetApprovalForAllCall extends ethereum.Call {
  get inputs(): SetApprovalForAllCall__Inputs {
    return new SetApprovalForAllCall__Inputs(this);
  }

  get outputs(): SetApprovalForAllCall__Outputs {
    return new SetApprovalForAllCall__Outputs(this);
  }
}

export class SetApprovalForAllCall__Inputs {
  _call: SetApprovalForAllCall;

  constructor(call: SetApprovalForAllCall) {
    this._call = call;
  }

  get operator(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get approved(): boolean {
    return this._call.inputValues[1].value.toBoolean();
  }
}

export class SetApprovalForAllCall__Outputs {
  _call: SetApprovalForAllCall;

  constructor(call: SetApprovalForAllCall) {
    this._call = call;
  }
}

export class TokenizeProjectCall extends ethereum.Call {
  get inputs(): TokenizeProjectCall__Inputs {
    return new TokenizeProjectCall__Inputs(this);
  }

  get outputs(): TokenizeProjectCall__Outputs {
    return new TokenizeProjectCall__Outputs(this);
  }
}

export class TokenizeProjectCall__Inputs {
  _call: TokenizeProjectCall;

  constructor(call: TokenizeProjectCall) {
    this._call = call;
  }

  get input(): TokenizeProjectCallInputStruct {
    return changetype<TokenizeProjectCallInputStruct>(
      this._call.inputValues[0].value.toTuple()
    );
  }

  get verifierSignatureData(): TokenizeProjectCallVerifierSignatureDataStruct {
    return changetype<TokenizeProjectCallVerifierSignatureDataStruct>(
      this._call.inputValues[1].value.toTuple()
    );
  }
}

export class TokenizeProjectCall__Outputs {
  _call: TokenizeProjectCall;

  constructor(call: TokenizeProjectCall) {
    this._call = call;
  }
}

export class TokenizeProjectCallInputStruct extends ethereum.Tuple {
  get projectUrl(): string {
    return this[0].toString();
  }

  get basePrice(): BigInt {
    return this[1].toBigInt();
  }

  get popularityFactorPrice(): BigInt {
    return this[2].toBigInt();
  }

  get paymentERC20Token(): Address {
    return this[3].toAddress();
  }

  get royality(): i32 {
    return this[4].toI32();
  }
}

export class TokenizeProjectCallVerifierSignatureDataStruct extends ethereum.Tuple {
  get signature(): Bytes {
    return this[0].toBytes();
  }

  get validUntil(): BigInt {
    return this[1].toBigInt();
  }

  get to(): Address {
    return this[2].toAddress();
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}

export class WithdrawEarningCall extends ethereum.Call {
  get inputs(): WithdrawEarningCall__Inputs {
    return new WithdrawEarningCall__Inputs(this);
  }

  get outputs(): WithdrawEarningCall__Outputs {
    return new WithdrawEarningCall__Outputs(this);
  }
}

export class WithdrawEarningCall__Inputs {
  _call: WithdrawEarningCall;

  constructor(call: WithdrawEarningCall) {
    this._call = call;
  }

  get tokenAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class WithdrawEarningCall__Outputs {
  _call: WithdrawEarningCall;

  constructor(call: WithdrawEarningCall) {
    this._call = call;
  }
}

export class WithdrawEarningToCall extends ethereum.Call {
  get inputs(): WithdrawEarningToCall__Inputs {
    return new WithdrawEarningToCall__Inputs(this);
  }

  get outputs(): WithdrawEarningToCall__Outputs {
    return new WithdrawEarningToCall__Outputs(this);
  }
}

export class WithdrawEarningToCall__Inputs {
  _call: WithdrawEarningToCall;

  constructor(call: WithdrawEarningToCall) {
    this._call = call;
  }

  get accountTo(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get tokenAddress(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class WithdrawEarningToCall__Outputs {
  _call: WithdrawEarningToCall;

  constructor(call: WithdrawEarningToCall) {
    this._call = call;
  }
}
