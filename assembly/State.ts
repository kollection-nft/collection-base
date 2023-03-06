import { System, chain, Base58 } from "@koinos/sdk-as";
import { collections } from "./proto/collections";
import { Constants } from "./Constants";

// spaces
const TOKEN_SPACE_ID = 0;
const CONFIG_SPACE_ID = 1;
const BALANCE_SPACE_ID = 2;
const TOKEN_APPROVAL_SPACE_ID = 3;
const OPERATOR_APPROVAL_SPACE_ID = 4;

// keys
const CONFIG_KEY = new Uint8Array(0);
const SUPPLY_KEY = new Uint8Array(1);

export class State {
  contractId: Uint8Array;
  tokenSpace: chain.object_space;
  configSpace: chain.object_space;
  balanceSpace: chain.object_space;
  aprovedSpace: chain.object_space;
  operatorSpace: chain.object_space;

  constructor(contractId: Uint8Array) {
    this.contractId = contractId;
    this.tokenSpace = new chain.object_space(false, contractId, TOKEN_SPACE_ID);
    this.configSpace = new chain.object_space(false, contractId, BALANCE_SPACE_ID);
    this.balanceSpace = new chain.object_space(false, contractId, CONFIG_SPACE_ID);

    this.aprovedSpace = new chain.object_space(false, contractId, TOKEN_APPROVAL_SPACE_ID);
    this.operatorSpace = new chain.object_space(false, contractId, OPERATOR_APPROVAL_SPACE_ID);
  }

  // tokens
  getToken(tokenId: string): collections.token_object | null {
    const token = System.getObject<string, collections.token_object>(this.tokenSpace, tokenId, collections.token_object.decode);
    return token;
  }
  saveToken(tokenId: string, token: collections.token_object): void {
    System.putObject(this.tokenSpace, tokenId, token, collections.token_object.encode);
  }

  // balance
  getBalance(owner: Uint8Array): collections.balance_object {
    const balance = System.getObject<Uint8Array, collections.balance_object>(this.balanceSpace, owner, collections.balance_object.decode);
    if (balance) {
      return balance;
    }
    return new collections.balance_object();
  }
  saveBalance(owner: Uint8Array, balance: collections.balance_object): void {
    System.putObject(this.balanceSpace, owner, balance, collections.balance_object.encode);
  }


  // approved
  getApproved(tokenId: string): collections.token_approval_object | null {
    const token = System.getObject<string, collections.token_approval_object>(this.aprovedSpace, tokenId, collections.token_approval_object.decode);
    return token;
  }
  saveApproved(tokenId: string, approval: collections.token_approval_object): void {
    System.putObject(this.aprovedSpace, tokenId, approval, collections.token_approval_object.encode);
  }
  removeApproved(tokenId: string): void {
    System.removeObject(this.aprovedSpace, tokenId);
  }

  // operator
  getApprovedOperator(approver: Uint8Array, operator: Uint8Array): collections.operator_approval_object | null {
    const key = `${Base58.encode(approver)}_${Base58.encode(operator)}`;
    const token = System.getObject<string, collections.operator_approval_object>(this.operatorSpace, key, collections.operator_approval_object.decode);
    return token;
  }
  saveApprovedOperator(approver: Uint8Array, operator: Uint8Array, approval: collections.operator_approval_object): void {
    const key = `${Base58.encode(approver)}_${Base58.encode(operator)}`;
    System.putObject(this.operatorSpace, key, approval, collections.operator_approval_object.encode);
  }

  // config
  getConfig(): collections.config_object {
    const config = System.getObject<Uint8Array, collections.config_object>(this.configSpace, CONFIG_KEY, collections.config_object.decode);
    if (config) {
      return config;
    }
    return new collections.config_object(Constants.OWNER);
  }
  saveConfig(config: collections.config_object): void {
    System.putObject(this.configSpace, CONFIG_KEY, config, collections.config_object.encode);
  }

  // supply
  getSupply(): collections.balance_object {
    const supply = System.getObject<Uint8Array, collections.balance_object>(this.configSpace, SUPPLY_KEY, collections.balance_object.decode);
    if (supply) {
      return supply;
    }
    return new collections.balance_object();
  }
  saveSupply(supply: collections.balance_object): void {
    System.putObject(this.configSpace, SUPPLY_KEY, supply, collections.balance_object.encode);
  }
}
