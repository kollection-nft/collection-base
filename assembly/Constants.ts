import { Base58 } from "@koinos/sdk-as";

export namespace Constants {
  export const NAME: string = "";
  export const SYMBOL: string = "";
  export const PRICE: u64 = 0;
  export const MAX: u64 = u64.MAX_VALUE;
  export const URI: string = "";
  export const OWNER: Uint8Array = Base58.decode("");

  // token mint
  export const TOKEN_PAY: Uint8Array = Base58.decode("");
  export const ADDRESS_PAY: Uint8Array = Base58.decode("");
}