import { Writer, Reader } from "as-proto";

export namespace collections {
  @unmanaged
  export class empty_object {
    static encode(message: empty_object, writer: Writer): void {}

    static decode(reader: Reader, length: i32): empty_object {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new empty_object();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    constructor() {}
  }

  export class string_object {
    static encode(message: string_object, writer: Writer): void {
      if (message.value.length != 0) {
        writer.uint32(10);
        writer.string(message.value);
      }
    }

    static decode(reader: Reader, length: i32): string_object {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new string_object();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.value = reader.string();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    value: string;

    constructor(value: string = "") {
      this.value = value;
    }
  }

  @unmanaged
  export class uint64_object {
    static encode(message: uint64_object, writer: Writer): void {
      if (message.value != 0) {
        writer.uint32(8);
        writer.uint64(message.value);
      }
    }

    static decode(reader: Reader, length: i32): uint64_object {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new uint64_object();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.value = reader.uint64();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    value: u64;

    constructor(value: u64 = 0) {
      this.value = value;
    }
  }

  @unmanaged
  export class bool_object {
    static encode(message: bool_object, writer: Writer): void {
      if (message.value != false) {
        writer.uint32(8);
        writer.bool(message.value);
      }
    }

    static decode(reader: Reader, length: i32): bool_object {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new bool_object();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.value = reader.bool();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    value: bool;

    constructor(value: bool = false) {
      this.value = value;
    }
  }

  export class address_object {
    static encode(message: address_object, writer: Writer): void {
      if (message.value.length != 0) {
        writer.uint32(10);
        writer.bytes(message.value);
      }
    }

    static decode(reader: Reader, length: i32): address_object {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new address_object();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.value = reader.bytes();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    value: Uint8Array;

    constructor(value: Uint8Array = new Uint8Array(0)) {
      this.value = value;
    }
  }

  export class token_object {
    static encode(message: token_object, writer: Writer): void {
      if (message.owner.length != 0) {
        writer.uint32(10);
        writer.bytes(message.owner);
      }
    }

    static decode(reader: Reader, length: i32): token_object {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new token_object();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.owner = reader.bytes();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    owner: Uint8Array;

    constructor(owner: Uint8Array = new Uint8Array(0)) {
      this.owner = owner;
    }
  }

  @unmanaged
  export class balance_object {
    static encode(message: balance_object, writer: Writer): void {
      if (message.value != 0) {
        writer.uint32(8);
        writer.uint64(message.value);
      }
    }

    static decode(reader: Reader, length: i32): balance_object {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new balance_object();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.value = reader.uint64();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    value: u64;

    constructor(value: u64 = 0) {
      this.value = value;
    }
  }

  export class royalty_object {
    static encode(message: royalty_object, writer: Writer): void {
      if (message.amount != 0) {
        writer.uint32(8);
        writer.uint64(message.amount);
      }

      if (message.address.length != 0) {
        writer.uint32(18);
        writer.bytes(message.address);
      }
    }

    static decode(reader: Reader, length: i32): royalty_object {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new royalty_object();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.amount = reader.uint64();
            break;

          case 2:
            message.address = reader.bytes();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    amount: u64;
    address: Uint8Array;

    constructor(amount: u64 = 0, address: Uint8Array = new Uint8Array(0)) {
      this.amount = amount;
      this.address = address;
    }
  }

  export class config_object {
    static encode(message: config_object, writer: Writer): void {
      if (message.owner.length != 0) {
        writer.uint32(10);
        writer.bytes(message.owner);
      }

      const unique_name_royalties = message.royalties;
      for (let i = 0; i < unique_name_royalties.length; ++i) {
        writer.uint32(18);
        writer.fork();
        royalty_object.encode(unique_name_royalties[i], writer);
        writer.ldelim();
      }
    }

    static decode(reader: Reader, length: i32): config_object {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new config_object();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.owner = reader.bytes();
            break;

          case 2:
            message.royalties.push(
              royalty_object.decode(reader, reader.uint32())
            );
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    owner: Uint8Array;
    royalties: Array<royalty_object>;

    constructor(
      owner: Uint8Array = new Uint8Array(0),
      royalties: Array<royalty_object> = []
    ) {
      this.owner = owner;
      this.royalties = royalties;
    }
  }

  export class token_approval_object {
    static encode(message: token_approval_object, writer: Writer): void {
      if (message.address.length != 0) {
        writer.uint32(10);
        writer.bytes(message.address);
      }
    }

    static decode(reader: Reader, length: i32): token_approval_object {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new token_approval_object();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.address = reader.bytes();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    address: Uint8Array;

    constructor(address: Uint8Array = new Uint8Array(0)) {
      this.address = address;
    }
  }

  @unmanaged
  export class operator_approval_object {
    static encode(message: operator_approval_object, writer: Writer): void {
      if (message.approved != false) {
        writer.uint32(8);
        writer.bool(message.approved);
      }
    }

    static decode(reader: Reader, length: i32): operator_approval_object {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new operator_approval_object();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.approved = reader.bool();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    approved: bool;

    constructor(approved: bool = false) {
      this.approved = approved;
    }
  }

  @unmanaged
  export class name_arguments {
    static encode(message: name_arguments, writer: Writer): void {}

    static decode(reader: Reader, length: i32): name_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new name_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    constructor() {}
  }

  @unmanaged
  export class uri_arguments {
    static encode(message: uri_arguments, writer: Writer): void {}

    static decode(reader: Reader, length: i32): uri_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new uri_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    constructor() {}
  }

  @unmanaged
  export class symbol_arguments {
    static encode(message: symbol_arguments, writer: Writer): void {}

    static decode(reader: Reader, length: i32): symbol_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new symbol_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    constructor() {}
  }

  export class get_approved_arguments {
    static encode(message: get_approved_arguments, writer: Writer): void {
      if (message.token_id.length != 0) {
        writer.uint32(10);
        writer.bytes(message.token_id);
      }
    }

    static decode(reader: Reader, length: i32): get_approved_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new get_approved_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.token_id = reader.bytes();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    token_id: Uint8Array;

    constructor(token_id: Uint8Array = new Uint8Array(0)) {
      this.token_id = token_id;
    }
  }

  export class is_approved_for_all_arguments {
    static encode(
      message: is_approved_for_all_arguments,
      writer: Writer
    ): void {
      if (message.owner.length != 0) {
        writer.uint32(10);
        writer.bytes(message.owner);
      }

      if (message.operator.length != 0) {
        writer.uint32(18);
        writer.bytes(message.operator);
      }
    }

    static decode(reader: Reader, length: i32): is_approved_for_all_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new is_approved_for_all_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.owner = reader.bytes();
            break;

          case 2:
            message.operator = reader.bytes();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    owner: Uint8Array;
    operator: Uint8Array;

    constructor(
      owner: Uint8Array = new Uint8Array(0),
      operator: Uint8Array = new Uint8Array(0)
    ) {
      this.owner = owner;
      this.operator = operator;
    }
  }

  @unmanaged
  export class total_supply_arguments {
    static encode(message: total_supply_arguments, writer: Writer): void {}

    static decode(reader: Reader, length: i32): total_supply_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new total_supply_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    constructor() {}
  }

  @unmanaged
  export class royalties_arguments {
    static encode(message: royalties_arguments, writer: Writer): void {}

    static decode(reader: Reader, length: i32): royalties_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new royalties_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    constructor() {}
  }

  export class royalties_result {
    static encode(message: royalties_result, writer: Writer): void {
      const unique_name_value = message.value;
      for (let i = 0; i < unique_name_value.length; ++i) {
        writer.uint32(10);
        writer.fork();
        royalty_object.encode(unique_name_value[i], writer);
        writer.ldelim();
      }
    }

    static decode(reader: Reader, length: i32): royalties_result {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new royalties_result();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.value.push(royalty_object.decode(reader, reader.uint32()));
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    value: Array<royalty_object>;

    constructor(value: Array<royalty_object> = []) {
      this.value = value;
    }
  }

  export class set_royalties_arguments {
    static encode(message: set_royalties_arguments, writer: Writer): void {
      const unique_name_value = message.value;
      for (let i = 0; i < unique_name_value.length; ++i) {
        writer.uint32(10);
        writer.fork();
        royalty_object.encode(unique_name_value[i], writer);
        writer.ldelim();
      }
    }

    static decode(reader: Reader, length: i32): set_royalties_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new set_royalties_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.value.push(royalty_object.decode(reader, reader.uint32()));
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    value: Array<royalty_object>;

    constructor(value: Array<royalty_object> = []) {
      this.value = value;
    }
  }

  @unmanaged
  export class owner_arguments {
    static encode(message: owner_arguments, writer: Writer): void {}

    static decode(reader: Reader, length: i32): owner_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new owner_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    constructor() {}
  }

  export class transfer_ownership_arguments {
    static encode(message: transfer_ownership_arguments, writer: Writer): void {
      if (message.owner.length != 0) {
        writer.uint32(10);
        writer.bytes(message.owner);
      }
    }

    static decode(reader: Reader, length: i32): transfer_ownership_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new transfer_ownership_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.owner = reader.bytes();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    owner: Uint8Array;

    constructor(owner: Uint8Array = new Uint8Array(0)) {
      this.owner = owner;
    }
  }

  export class balance_of_arguments {
    static encode(message: balance_of_arguments, writer: Writer): void {
      if (message.owner.length != 0) {
        writer.uint32(10);
        writer.bytes(message.owner);
      }
    }

    static decode(reader: Reader, length: i32): balance_of_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new balance_of_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.owner = reader.bytes();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    owner: Uint8Array;

    constructor(owner: Uint8Array = new Uint8Array(0)) {
      this.owner = owner;
    }
  }

  export class owner_of_arguments {
    static encode(message: owner_of_arguments, writer: Writer): void {
      if (message.token_id.length != 0) {
        writer.uint32(10);
        writer.bytes(message.token_id);
      }
    }

    static decode(reader: Reader, length: i32): owner_of_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new owner_of_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.token_id = reader.bytes();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    token_id: Uint8Array;

    constructor(token_id: Uint8Array = new Uint8Array(0)) {
      this.token_id = token_id;
    }
  }

  export class mint_arguments {
    static encode(message: mint_arguments, writer: Writer): void {
      if (message.to.length != 0) {
        writer.uint32(10);
        writer.bytes(message.to);
      }

      if (message.number_tokens_to_mint != 0) {
        writer.uint32(16);
        writer.uint64(message.number_tokens_to_mint);
      }
    }

    static decode(reader: Reader, length: i32): mint_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new mint_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.to = reader.bytes();
            break;

          case 2:
            message.number_tokens_to_mint = reader.uint64();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    to: Uint8Array;
    number_tokens_to_mint: u64;

    constructor(
      to: Uint8Array = new Uint8Array(0),
      number_tokens_to_mint: u64 = 0
    ) {
      this.to = to;
      this.number_tokens_to_mint = number_tokens_to_mint;
    }
  }

  export class burn_arguments {
    static encode(message: burn_arguments, writer: Writer): void {
      if (message.from.length != 0) {
        writer.uint32(10);
        writer.bytes(message.from);
      }

      if (message.token_id.length != 0) {
        writer.uint32(18);
        writer.bytes(message.token_id);
      }
    }

    static decode(reader: Reader, length: i32): burn_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new burn_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.from = reader.bytes();
            break;

          case 2:
            message.token_id = reader.bytes();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    from: Uint8Array;
    token_id: Uint8Array;

    constructor(
      from: Uint8Array = new Uint8Array(0),
      token_id: Uint8Array = new Uint8Array(0)
    ) {
      this.from = from;
      this.token_id = token_id;
    }
  }

  export class transfer_arguments {
    static encode(message: transfer_arguments, writer: Writer): void {
      if (message.from.length != 0) {
        writer.uint32(10);
        writer.bytes(message.from);
      }

      if (message.to.length != 0) {
        writer.uint32(18);
        writer.bytes(message.to);
      }

      if (message.token_id.length != 0) {
        writer.uint32(26);
        writer.bytes(message.token_id);
      }
    }

    static decode(reader: Reader, length: i32): transfer_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new transfer_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.from = reader.bytes();
            break;

          case 2:
            message.to = reader.bytes();
            break;

          case 3:
            message.token_id = reader.bytes();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    from: Uint8Array;
    to: Uint8Array;
    token_id: Uint8Array;

    constructor(
      from: Uint8Array = new Uint8Array(0),
      to: Uint8Array = new Uint8Array(0),
      token_id: Uint8Array = new Uint8Array(0)
    ) {
      this.from = from;
      this.to = to;
      this.token_id = token_id;
    }
  }

  export class approve_arguments {
    static encode(message: approve_arguments, writer: Writer): void {
      if (message.approver_address.length != 0) {
        writer.uint32(10);
        writer.bytes(message.approver_address);
      }

      if (message.to.length != 0) {
        writer.uint32(18);
        writer.bytes(message.to);
      }

      if (message.token_id.length != 0) {
        writer.uint32(26);
        writer.bytes(message.token_id);
      }
    }

    static decode(reader: Reader, length: i32): approve_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new approve_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.approver_address = reader.bytes();
            break;

          case 2:
            message.to = reader.bytes();
            break;

          case 3:
            message.token_id = reader.bytes();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    approver_address: Uint8Array;
    to: Uint8Array;
    token_id: Uint8Array;

    constructor(
      approver_address: Uint8Array = new Uint8Array(0),
      to: Uint8Array = new Uint8Array(0),
      token_id: Uint8Array = new Uint8Array(0)
    ) {
      this.approver_address = approver_address;
      this.to = to;
      this.token_id = token_id;
    }
  }

  export class set_approval_for_all_arguments {
    static encode(
      message: set_approval_for_all_arguments,
      writer: Writer
    ): void {
      if (message.approver_address.length != 0) {
        writer.uint32(10);
        writer.bytes(message.approver_address);
      }

      if (message.operator_address.length != 0) {
        writer.uint32(18);
        writer.bytes(message.operator_address);
      }

      if (message.approved != false) {
        writer.uint32(24);
        writer.bool(message.approved);
      }
    }

    static decode(reader: Reader, length: i32): set_approval_for_all_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new set_approval_for_all_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.approver_address = reader.bytes();
            break;

          case 2:
            message.operator_address = reader.bytes();
            break;

          case 3:
            message.approved = reader.bool();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    approver_address: Uint8Array;
    operator_address: Uint8Array;
    approved: bool;

    constructor(
      approver_address: Uint8Array = new Uint8Array(0),
      operator_address: Uint8Array = new Uint8Array(0),
      approved: bool = false
    ) {
      this.approver_address = approver_address;
      this.operator_address = operator_address;
      this.approved = approved;
    }
  }

  @unmanaged
  export class get_info_arguments {
    static encode(message: get_info_arguments, writer: Writer): void {}

    static decode(reader: Reader, length: i32): get_info_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new get_info_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    constructor() {}
  }

  export class get_info_result {
    static encode(message: get_info_result, writer: Writer): void {
      if (message.id_type.length != 0) {
        writer.uint32(10);
        writer.string(message.id_type);
      }
    }

    static decode(reader: Reader, length: i32): get_info_result {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new get_info_result();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.id_type = reader.string();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    id_type: string;

    constructor(id_type: string = "") {
      this.id_type = id_type;
    }
  }

  export class mint_event {
    static encode(message: mint_event, writer: Writer): void {
      if (message.to.length != 0) {
        writer.uint32(10);
        writer.bytes(message.to);
      }

      if (message.token_id.length != 0) {
        writer.uint32(18);
        writer.bytes(message.token_id);
      }
    }

    static decode(reader: Reader, length: i32): mint_event {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new mint_event();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.to = reader.bytes();
            break;

          case 2:
            message.token_id = reader.bytes();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    to: Uint8Array;
    token_id: Uint8Array;

    constructor(
      to: Uint8Array = new Uint8Array(0),
      token_id: Uint8Array = new Uint8Array(0)
    ) {
      this.to = to;
      this.token_id = token_id;
    }
  }

  export class burn_event {
    static encode(message: burn_event, writer: Writer): void {
      if (message.from.length != 0) {
        writer.uint32(10);
        writer.bytes(message.from);
      }

      if (message.token_id.length != 0) {
        writer.uint32(18);
        writer.bytes(message.token_id);
      }
    }

    static decode(reader: Reader, length: i32): burn_event {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new burn_event();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.from = reader.bytes();
            break;

          case 2:
            message.token_id = reader.bytes();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    from: Uint8Array;
    token_id: Uint8Array;

    constructor(
      from: Uint8Array = new Uint8Array(0),
      token_id: Uint8Array = new Uint8Array(0)
    ) {
      this.from = from;
      this.token_id = token_id;
    }
  }

  export class transfer_event {
    static encode(message: transfer_event, writer: Writer): void {
      if (message.from.length != 0) {
        writer.uint32(10);
        writer.bytes(message.from);
      }

      if (message.to.length != 0) {
        writer.uint32(18);
        writer.bytes(message.to);
      }

      if (message.token_id.length != 0) {
        writer.uint32(26);
        writer.bytes(message.token_id);
      }
    }

    static decode(reader: Reader, length: i32): transfer_event {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new transfer_event();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.from = reader.bytes();
            break;

          case 2:
            message.to = reader.bytes();
            break;

          case 3:
            message.token_id = reader.bytes();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    from: Uint8Array;
    to: Uint8Array;
    token_id: Uint8Array;

    constructor(
      from: Uint8Array = new Uint8Array(0),
      to: Uint8Array = new Uint8Array(0),
      token_id: Uint8Array = new Uint8Array(0)
    ) {
      this.from = from;
      this.to = to;
      this.token_id = token_id;
    }
  }

  export class operator_approval_event {
    static encode(message: operator_approval_event, writer: Writer): void {
      if (message.approver_address.length != 0) {
        writer.uint32(10);
        writer.bytes(message.approver_address);
      }

      if (message.operator_address.length != 0) {
        writer.uint32(18);
        writer.bytes(message.operator_address);
      }

      if (message.approved != false) {
        writer.uint32(24);
        writer.bool(message.approved);
      }
    }

    static decode(reader: Reader, length: i32): operator_approval_event {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new operator_approval_event();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.approver_address = reader.bytes();
            break;

          case 2:
            message.operator_address = reader.bytes();
            break;

          case 3:
            message.approved = reader.bool();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    approver_address: Uint8Array;
    operator_address: Uint8Array;
    approved: bool;

    constructor(
      approver_address: Uint8Array = new Uint8Array(0),
      operator_address: Uint8Array = new Uint8Array(0),
      approved: bool = false
    ) {
      this.approver_address = approver_address;
      this.operator_address = operator_address;
      this.approved = approved;
    }
  }

  export class token_approval_event {
    static encode(message: token_approval_event, writer: Writer): void {
      if (message.approver_address.length != 0) {
        writer.uint32(10);
        writer.bytes(message.approver_address);
      }

      if (message.to.length != 0) {
        writer.uint32(18);
        writer.bytes(message.to);
      }

      if (message.token_id.length != 0) {
        writer.uint32(26);
        writer.bytes(message.token_id);
      }
    }

    static decode(reader: Reader, length: i32): token_approval_event {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new token_approval_event();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.approver_address = reader.bytes();
            break;

          case 2:
            message.to = reader.bytes();
            break;

          case 3:
            message.token_id = reader.bytes();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    approver_address: Uint8Array;
    to: Uint8Array;
    token_id: Uint8Array;

    constructor(
      approver_address: Uint8Array = new Uint8Array(0),
      to: Uint8Array = new Uint8Array(0),
      token_id: Uint8Array = new Uint8Array(0)
    ) {
      this.approver_address = approver_address;
      this.to = to;
      this.token_id = token_id;
    }
  }
}
