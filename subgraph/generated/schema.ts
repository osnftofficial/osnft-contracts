// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class ExampleEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ExampleEntity entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type ExampleEntity must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("ExampleEntity", id.toString(), this);
    }
  }

  static load(id: string): ExampleEntity | null {
    return changetype<ExampleEntity | null>(store.get("ExampleEntity", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get count(): BigInt {
    let value = this.get("count");
    return value!.toBigInt();
  }

  set count(value: BigInt) {
    this.set("count", Value.fromBigInt(value));
  }

  get account(): Bytes {
    let value = this.get("account");
    return value!.toBytes();
  }

  set account(value: Bytes) {
    this.set("account", Value.fromBytes(value));
  }

  get operator(): Bytes {
    let value = this.get("operator");
    return value!.toBytes();
  }

  set operator(value: Bytes) {
    this.set("operator", Value.fromBytes(value));
  }
}

export class Project extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Project entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Project must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Project", id.toString(), this);
    }
  }

  static load(id: string): Project | null {
    return changetype<Project | null>(store.get("Project", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get creator(): Bytes {
    let value = this.get("creator");
    return value!.toBytes();
  }

  set creator(value: Bytes) {
    this.set("creator", Value.fromBytes(value));
  }

  get projectUrl(): string {
    let value = this.get("projectUrl");
    return value!.toString();
  }

  set projectUrl(value: string) {
    this.set("projectUrl", Value.fromString(value));
  }

  get basePrice(): BigInt {
    let value = this.get("basePrice");
    return value!.toBigInt();
  }

  set basePrice(value: BigInt) {
    this.set("basePrice", Value.fromBigInt(value));
  }

  get popularityFactorPrice(): BigInt {
    let value = this.get("popularityFactorPrice");
    return value!.toBigInt();
  }

  set popularityFactorPrice(value: BigInt) {
    this.set("popularityFactorPrice", Value.fromBigInt(value));
  }

  get paymentToken(): Bytes {
    let value = this.get("paymentToken");
    return value!.toBytes();
  }

  set paymentToken(value: Bytes) {
    this.set("paymentToken", Value.fromBytes(value));
  }

  get creatorRoyality(): i32 {
    let value = this.get("creatorRoyality");
    return value!.toI32();
  }

  set creatorRoyality(value: i32) {
    this.set("creatorRoyality", Value.fromI32(value));
  }

  get tokenCount(): BigInt {
    let value = this.get("tokenCount");
    return value!.toBigInt();
  }

  set tokenCount(value: BigInt) {
    this.set("tokenCount", Value.fromBigInt(value));
  }

  get treasuryTotalAmount(): BigInt {
    let value = this.get("treasuryTotalAmount");
    return value!.toBigInt();
  }

  set treasuryTotalAmount(value: BigInt) {
    this.set("treasuryTotalAmount", Value.fromBigInt(value));
  }

  get lastMintPrice(): BigInt {
    let value = this.get("lastMintPrice");
    return value!.toBigInt();
  }

  set lastMintPrice(value: BigInt) {
    this.set("lastMintPrice", Value.fromBigInt(value));
  }

  get tokens(): Array<string> {
    let value = this.get("tokens");
    return value!.toStringArray();
  }

  set tokens(value: Array<string>) {
    this.set("tokens", Value.fromStringArray(value));
  }
}

export class ProjectToken extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ProjectToken entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type ProjectToken must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("ProjectToken", id.toString(), this);
    }
  }

  static load(id: string): ProjectToken | null {
    return changetype<ProjectToken | null>(store.get("ProjectToken", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get mintAmount(): BigInt {
    let value = this.get("mintAmount");
    return value!.toBigInt();
  }

  set mintAmount(value: BigInt) {
    this.set("mintAmount", Value.fromBigInt(value));
  }

  get star(): BigInt {
    let value = this.get("star");
    return value!.toBigInt();
  }

  set star(value: BigInt) {
    this.set("star", Value.fromBigInt(value));
  }

  get fork(): BigInt {
    let value = this.get("fork");
    return value!.toBigInt();
  }

  set fork(value: BigInt) {
    this.set("fork", Value.fromBigInt(value));
  }

  get project(): string {
    let value = this.get("project");
    return value!.toString();
  }

  set project(value: string) {
    this.set("project", Value.fromString(value));
  }

  get owner(): Bytes {
    let value = this.get("owner");
    return value!.toBytes();
  }

  set owner(value: Bytes) {
    this.set("owner", Value.fromBytes(value));
  }
}

export class Account extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Account entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type Account must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Account", id.toBytes().toHexString(), this);
    }
  }

  static load(id: Bytes): Account | null {
    return changetype<Account | null>(store.get("Account", id.toHexString()));
  }

  get id(): Bytes {
    let value = this.get("id");
    return value!.toBytes();
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get tokenCount(): BigInt {
    let value = this.get("tokenCount");
    return value!.toBigInt();
  }

  set tokenCount(value: BigInt) {
    this.set("tokenCount", Value.fromBigInt(value));
  }

  get totalInvestedAmount(): BigInt {
    let value = this.get("totalInvestedAmount");
    return value!.toBigInt();
  }

  set totalInvestedAmount(value: BigInt) {
    this.set("totalInvestedAmount", Value.fromBigInt(value));
  }
}
