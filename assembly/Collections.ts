import { System, SafeMath, Protobuf, Arrays, authority, Token } from "@koinos/sdk-as";
import { collections } from "./proto/collections";

// libs
import { State } from "./State"
import { Constants } from "./Constants";

export class Collections {
  _contractId: Uint8Array;
  _state: State;

  constructor() {
    this._contractId = System.getContractId();
    this._state = new State(this._contractId);
  }

  name(args: collections.name_arguments): collections.name_result {
    return new collections.name_result(Constants.NAME);
  }

  symbol(args: collections.symbol_arguments): collections.symbol_result {
    return new collections.symbol_result(Constants.SYMBOL);
  }

  uri(args: collections.uri_arguments): collections.uri_result {
    return new collections.uri_result(Constants.URI);
  }

  total_supply(args: collections.total_supply_arguments): collections.total_supply_result {
    const supply = this._state.getSupply();
    return new collections.total_supply_result(supply.value);
  }

  royalties(args: collections.royalties_arguments): collections.royalties_result {
    let config = this._state.getConfig();
    return new collections.royalties_result(config.royalties);
  }

  set_royalties(args: collections.set_royalties_arguments): collections.set_royalties_result {
    let res = new collections.set_royalties_result();
    // check owner
    let config = this._state.getConfig();
    this._checkOwner(config);
    // check max royaltie
    let royalties = args.value;
    let royaltiesTotal: u64 = 0;
    for (let index = 0; index < royalties.length; index++) {
      let royalty = royalties[index];
      royaltiesTotal = SafeMath.add(royaltiesTotal, royalty.amount);
    }
    System.require(royaltiesTotal<=10000, "MarketplaceV1.execute: ROYALTY_EXEDED_MAX");
    // update royalties
    config.royalties = args.value;
    this._state.saveConfig(config);
    // update
    res.value = true;
    return res;
  }

  owner(args: collections.owner_arguments): collections.owner_result {
    let config = this._state.getConfig();
    return new collections.owner_result(config.owner);
  }

  transfer_ownership(args: collections.transfer_ownership_arguments): collections.transfer_ownership_result {
    let res = new collections.transfer_ownership_result()
    // check owner
    let config = this._state.getConfig();
    this._checkOwner(config);
    // update owner
    config.owner = args.owner;
    this._state.saveConfig(config);
    // update
    res.value = true;
    return res;
  }

  balance_of(args: collections.balance_of_arguments): collections.balance_of_result {
    const owner = args.owner as Uint8Array;
    const balanceObj = this._state.getBalance(owner);
    const res = new collections.balance_of_result();
    res.value = balanceObj.value;
    return res;
  }

  owner_of(args: collections.owner_of_arguments): collections.owner_of_result {
    const token_id = args.token_id;
    const res = new collections.owner_of_result();
    const token = this._state.getToken(token_id);
    if (token) {
      res.value = token.owner;
    }
    return res;
  }

  get_approved(args: collections.get_approved_arguments): collections.get_approved_result {
    const token_id = args.token_id;
    const res = new collections.get_approved_result();
    const approval = this._state.getApproved(token_id);
    if (approval) {
      res.value = approval.address;
    }
    return res;
  }

  is_approved_for_all(args: collections.is_approved_for_all_arguments): collections.is_approved_for_all_result {
    const owner = args.owner as Uint8Array;
    const operator = args.operator as Uint8Array;
    const res = new collections.is_approved_for_all_result();
    const approval = this._state.getApprovedOperator(owner, operator);
    if (approval) {
      res.value = approval.approved;
    }
    return res;
  }

  mint(args: collections.mint_arguments): collections.mint_result {
    let to = args.to as Uint8Array;
    let res = new collections.mint_result(false);

    // process
    let supply = this._state.getSupply();
    let balance = this._state.getBalance(to);
    let tokens = SafeMath.add(supply.value, args.tokens);

    // pay mint price token or check creator
    if(Constants.FEE_MINT) {
      let token_pay = new Token(Constants.TOKEN_PAY);
      let _result = token_pay.transfer(to, Constants.ADDRESS_PAY, Constants.PRICE);
      System.require(_result, "Failed to pay mint")
    } else {
      System.requireAuthority(authority.authorization_type.contract_call, Constants.OWNER);
    }
    

    // check limit amount tokens
    System.require(tokens > 0, "token id out of bounds")
    // check limit amount tokens
    System.require(tokens <= Constants.MAX, "token id out of bounds")
    
    // assign the new token's owner
    let start = SafeMath.add(supply.value, 1)
    for (let index = start; index <= tokens; index++) {
      
      // mint token
      let newToken = new collections.token_object(to);
      this._state.saveToken(index, newToken);

      // events
      const mintEvent = new collections.mint_event(to, index);
      const impacted = [to];
      System.event(
        "nft.mint",
        Protobuf.encode(mintEvent, collections.mint_event.encode),
        impacted
      );
    }

    // update the owner's balance
    balance.value = SafeMath.add(balance.value, args.tokens);

    // check limit address
    System.require(balance.value <= 10, "exceeds the limit of tokens per address")

    // increment supply
    supply.value = SafeMath.add(supply.value, args.tokens);

    // save new states
    this._state.saveBalance(to, balance);
    this._state.saveSupply(supply);

    res.value = true;
    return res;
  }

  transfer(args: collections.transfer_arguments): collections.transfer_result {
    let res = new collections.transfer_result();
    // data
    const from = args.from as Uint8Array;
    const to = args.to as Uint8Array;
    const token_id = args.token_id;

    // process
    let token = this._state.getToken(token_id);
    if (!token) {
      System.log("nonexistent token");
      return res;
    }

    if(!Arrays.equal(token.owner, from)) {
      System.log("from is not a owner");
      return res;
    }

    // check authorize tokens
    let isTokenApproved: bool = false;
    const caller = System.getCaller();
    if(!Arrays.equal(caller.caller, from)) {
      const approval = this._state.getApproved(token_id);
      if(approval) {
        let approvedAddress  = approval.address as Uint8Array;
        isTokenApproved = Arrays.equal(approvedAddress, caller.caller);
      }
      if(!isTokenApproved) {
        const operatorApproval = this._state.getApprovedOperator(token.owner, caller.caller);
        if(operatorApproval) {
          isTokenApproved = operatorApproval.approved;
        }
        if(!isTokenApproved) {
          isTokenApproved = System.checkAuthority(authority.authorization_type.contract_call, from)
        }
      }
      if(!isTokenApproved) {
        System.log("from has not authorized transfer");
        return res;
      }
    }
    // clear the token approval
    this._state.removeApproved(token_id);

    // update the owner token
    token.owner = to;

    // update the current owner's balance
    const balance_from = this._state.getBalance(from);
    balance_from.value = SafeMath.sub(balance_from.value, 1);

    // update the new owner's balance
    const balance_to = this._state.getBalance(to);
    balance_to.value = SafeMath.add(balance_to.value, 1);

    // save new states
    this._state.saveToken(token_id, token);
    this._state.saveBalance(to, balance_to);
    this._state.saveBalance(from, balance_from);

    // generate event
    const mintEvent = new collections.transfer_event(from, to, token_id);
    const impacted = [to];
    System.event(
      "nft.transfer",
      Protobuf.encode(mintEvent, collections.transfer_event.encode),
      impacted
    );

    res.value = true
    return res;
  }

  approve(args: collections.approve_arguments): collections.approve_result {
    const approver_address = args.approver_address as Uint8Array;
    const to = args.to as Uint8Array;
    const token_id = args.token_id;
    const res = new collections.approve_result(false);

    // require authority of the approver_address
    System.requireAuthority(
      authority.authorization_type.contract_call,
      approver_address
    );

    // check that the token exists
    let token = this._state.getToken(token_id);
    if (!token) {
      System.log("nonexistent token");
      return res;
    }

    // check that the to is not the owner
    if(Arrays.equal(token.owner, to)) {
      System.log("approve to current owner");
      return res;
    }

    // check that the approver_address is allowed to approve the token
    if(!Arrays.equal(token.owner, approver_address)) {
      let approval = this._state.getApprovedOperator(token.owner, approver_address)
      if (!approval!.approved) {
        System.log("approver_address is not owner nor approved");
        return res;
      }
    }

    // update approval
    let approval = this._state.getApproved(token_id);
    if(!approval) {
      approval = new collections.token_approval_object(to)
    }
    this._state.saveApproved(token_id, approval);

    // generate event
    const approvalEvent = new collections.token_approval_event(
      approver_address,
      to,
      token_id
    );
    const impacted = [to, approver_address];
    System.event(
      "nft.token_approval",
      Protobuf.encode(approvalEvent, collections.token_approval_event.encode),
      impacted
    );

    // result
    res.value = true;
    return res;
  }

  set_approval_for_all(args: collections.set_approval_for_all_arguments): collections.set_approval_for_all_result {
    const approver_address = args.approver_address as Uint8Array;
    const operator_address = args.operator_address as Uint8Array;
    const approved = args.approved;
    const res = new collections.set_approval_for_all_result(false);

    // only the owner of approver_address can approve an operator for his account
    System.requireAuthority(
      authority.authorization_type.contract_call,
      approver_address
    );

    // check that the approver_address is not the address to approve
    if(Arrays.equal(approver_address, operator_address)) {
      System.log("approve to operator_address");
      return res;
    }

    // update the approval
    let approval = this._state.getApprovedOperator(operator_address, approver_address);
    if(!approval) {
      approval = new collections.operator_approval_object(approved)
    }

    this._state.saveApprovedOperator(operator_address, approver_address, approval);

    // generate event
    const approvalEvent = new collections.operator_approval_event(
      approver_address,
      operator_address,
      approved
    );
    const impacted = [operator_address, approver_address];
    System.event(
      "nft.operator_approval",
      Protobuf.encode(approvalEvent, collections.operator_approval_event.encode),
      impacted
    );

    // result
    res.value = true;
    return res;
  }

  /**
   * Helpers
   */
  _checkOwner(config: collections.config_object): void {
    let currentOwner: Uint8Array
    if(config.owner.length) {
      currentOwner = config.owner;
    } else {
      currentOwner = Constants.OWNER;
    }
    System.requireAuthority(authority.authorization_type.contract_call, currentOwner);
  }
}
