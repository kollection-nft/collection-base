import { System, SafeMath, Protobuf, Arrays, authority, Token, error, StringBytes } from "@koinos/sdk-as";
import { collections } from "./proto/collections";

// libs
import { State } from "./State";
import { Constants } from "./Constants";

export class Collections {
  _contractId: Uint8Array;
  _state: State;

  constructor() {
    this._contractId = System.getContractId();
    this._state = new State(this._contractId);
  }

  name(args: collections.name_arguments): collections.string_object {
    return new collections.string_object(Constants.NAME);
  }

  symbol(args: collections.symbol_arguments): collections.string_object {
    return new collections.string_object(Constants.SYMBOL);
  }

  uri(args: collections.uri_arguments): collections.string_object {
    return new collections.string_object(Constants.URI);
  }

  total_supply(args: collections.total_supply_arguments): collections.uint64_object {
    const supply = this._state.getSupply();
    return new collections.uint64_object(supply.value);
  }

  royalties(args: collections.royalties_arguments): collections.royalties_result {
    const config = this._state.getConfig();
    return new collections.royalties_result(config.royalties);
  }

  set_royalties(args: collections.set_royalties_arguments): collections.empty_object {
    // check owner
    const config = this._state.getConfig();
    this._checkOwner(config);
    // check max royaltie
    const royalties = args.value;
    let royaltiesTotal: u64 = 0;
    let impacted: Uint8Array[] = []
    for (let index = 0; index < royalties.length; index++) {
      let royalty = royalties[index];
      impacted.push(royalty.address);
      royaltiesTotal = SafeMath.add(royaltiesTotal, royalty.amount);
    }
    System.require(royaltiesTotal <= 10000, "MarketplaceV1.execute: ROYALTY_EXEDED_MAX");
    // update royalties
    config.royalties = args.value;
    this._state.saveConfig(config);

    const royaltiesEvent = new collections.royalties_event(royalties);
    System.event(
      "collections.royalties_event",
      Protobuf.encode(royaltiesEvent, collections.royalties_event.encode),
      impacted
    );

    return new collections.empty_object();
  }

  owner(args: collections.owner_arguments): collections.address_object {
    const config = this._state.getConfig();
    return new collections.address_object(config.owner);
  }

  transfer_ownership(args: collections.transfer_ownership_arguments): collections.empty_object {
    // check owner
    const config = this._state.getConfig();
    this._checkOwner(config);

    // event
    const ownerEvent = new collections.owner_event(config.owner, args.owner);
    const impacted = [ config.owner, args.owner ]

    // update owner
    config.owner = args.owner;
    this._state.saveConfig(config);

    System.event(
      "collections.owner_event",
      Protobuf.encode(ownerEvent, collections.owner_event.encode),
      impacted
    );

    return new collections.empty_object();
  }

  balance_of(args: collections.balance_of_arguments): collections.uint64_object {
    const owner = args.owner as Uint8Array;
    const balanceObj = this._state.getBalance(owner);
    return new collections.uint64_object(balanceObj.value);
  }

  owner_of(args: collections.owner_of_arguments): collections.address_object {
    const token_id = StringBytes.bytesToString(args.token_id);
    const res = new collections.address_object();
    const token = this._state.getToken(token_id);
    if (token) {
      res.value = token.owner;
    }
    return res;
  }

  get_approved(args: collections.get_approved_arguments): collections.address_object {
    const token_id = StringBytes.bytesToString(args.token_id);
    const res = new collections.address_object();
    const approval = this._state.getApproved(token_id);
    if (approval) {
      res.value = approval.address;
    }
    return res;
  }

  is_approved_for_all(args: collections.is_approved_for_all_arguments): collections.bool_object {
    const owner = args.owner as Uint8Array;
    const operator = args.operator as Uint8Array;
    const res = new collections.bool_object();
    const approval = this._state.getApprovedOperator(owner, operator);
    if (approval) {
      res.value = approval.approved;
    }
    return res;
  }

  mint(args: collections.mint_arguments): collections.empty_object {
    const to = args.to;

    // process
    const supply = this._state.getSupply();
    const balance = this._state.getBalance(to);
    const tokens = SafeMath.add(supply.value, args.number_tokens_to_mint);

    // pay mint price token or check creator
    if (Constants.MINT_FEE > 0) {
      const token_pay = new Token(Constants.TOKEN_PAY);
      const _result = token_pay.transfer(to, Constants.ADDRESS_PAY, SafeMath.mul(args.number_tokens_to_mint, Constants.MINT_PRICE));
      System.require(_result, "Failed to pay mint");
    } else if (Constants.OWNER.length > 0) {
      // if OWNER is setup
      System.requireAuthority(authority.authorization_type.contract_call, Constants.OWNER);
    } else {
      // otherwise, check contract id permissions
      System.requireAuthority(authority.authorization_type.contract_call, this._contractId);
    }

    // check limit amount tokens
    System.require(tokens > 0, "token id out of bounds");
    // check limit amount tokens
    System.require(tokens <= Constants.MAX_SUPPLY, "token id out of bounds");

    // assign the new token's owner
    const start = SafeMath.add(supply.value, 1);
    const newToken = new collections.token_object();
    let tokenId: string;

    for (let index = start; index <= tokens; index++) {
      tokenId = index.toString();

      // mint token
      newToken.owner = to;
      this._state.saveToken(tokenId, newToken);

      // events
      const mintEvent = new collections.mint_event(
        to,
        StringBytes.stringToBytes(tokenId)
      );

      const impacted = [to];
      System.event(
        "collections.mint_event",
        Protobuf.encode(mintEvent, collections.mint_event.encode),
        impacted
      );
    }

    // update the owner's balance
    balance.value = SafeMath.add(balance.value, args.number_tokens_to_mint);

    // check limit address
    System.require(balance.value <= 10, "exceeds the limit of tokens per address");

    // increment supply
    supply.value = SafeMath.add(supply.value, args.number_tokens_to_mint);

    // save new states
    this._state.saveBalance(to, balance);
    this._state.saveSupply(supply);

    return new collections.empty_object();
  }

  burn(args: collections.burn_arguments): collections.empty_object {
    // const from = args.from;
    // const token_id = args.token_id;

    // // YOUR CODE HERE


    // // event
    // const burnEvent = new collections.mint_event(
    //   from,
    //   token_id
    // );

    // const impacted = [from];
    // System.event(
    //   "collections.burn_event",
    //   Protobuf.encode(burnEvent, collections.mint_event.encode),
    //   impacted
    // );

    return new collections.empty_object();
  }

  transfer(args: collections.transfer_arguments): collections.empty_object {
    // data
    const from = args.from;
    const to = args.to;
    const token_id = StringBytes.bytesToString(args.token_id);

    // process
    const token = this._state.getToken(token_id);

    // check if the token exists
    System.require(token != null, "nonexistent token", error.error_code.failure);

    // check if owner if from
    System.require(Arrays.equal(token!.owner, from), "from is not a owner", error.error_code.authorization_failure);

    // check authorize tokens
    let isTokenApproved: bool = false;
    const caller = System.getCaller();
    if (!Arrays.equal(caller.caller, from)) {
      const approval = this._state.getApproved(token_id);
      if (approval) {
        let approvedAddress = approval.address as Uint8Array;
        isTokenApproved = Arrays.equal(approvedAddress, caller.caller);
      }
      if (!isTokenApproved) {
        const operatorApproval = this._state.getApprovedOperator(token!.owner, caller.caller);
        if (operatorApproval) {
          isTokenApproved = operatorApproval.approved;
        }
        if (!isTokenApproved) {
          isTokenApproved = System.checkAuthority(authority.authorization_type.contract_call, from);
        }
      }
      System.require(isTokenApproved, "from has not authorized transfer", error.error_code.authorization_failure);
    }
    // clear the token approval
    this._state.removeApproved(token_id);

    // update the owner token
    token!.owner = to;

    // update the current owner's balance
    const balance_from = this._state.getBalance(from);
    balance_from.value = SafeMath.sub(balance_from.value, 1);

    // update the new owner's balance
    const balance_to = this._state.getBalance(to);
    balance_to.value = SafeMath.add(balance_to.value, 1);

    // save new states
    this._state.saveToken(token_id, token!);
    this._state.saveBalance(to, balance_to);
    this._state.saveBalance(from, balance_from);

    // generate event
    const transferEvent = new collections.transfer_event(from, to, args.token_id);
    const impacted = [to, from];
    System.event(
      "collections.transfer_event",
      Protobuf.encode(transferEvent, collections.transfer_event.encode),
      impacted
    );

    return new collections.empty_object();
  }

  approve(args: collections.approve_arguments): collections.empty_object {
    const approver_address = args.approver_address;
    const to = args.to;
    const token_id = StringBytes.bytesToString(args.token_id);

    // require authority of the approver_address
    System.requireAuthority(
      authority.authorization_type.contract_call,
      approver_address
    );

    // check that the token exists
    let token = this._state.getToken(token_id);
    System.require(token != null, "nonexistent token", error.error_code.failure);

    // check that the to is not the owner
    System.require(!Arrays.equal(token!.owner, to), "approve to current owner", error.error_code.failure);

    // check that the approver_address is allowed to approve the token
    if (!Arrays.equal(token!.owner, approver_address)) {
      let approval = this._state.getApprovedOperator(token!.owner, approver_address);
      System.require(approval != null, "approved does not exist", error.error_code.authorization_failure);
      System.require(approval!.approved, "approver_address is not owner", error.error_code.authorization_failure);
    }

    // update approval
    let approval = new collections.token_approval_object(to);
    this._state.saveApproved(token_id, approval);

    // generate event
    const approvalEvent = new collections.token_approval_event(
      approver_address,
      to,
      args.token_id
    );
    const impacted = [to, approver_address];
    System.event(
      "collections.token_approval_event",
      Protobuf.encode(approvalEvent, collections.token_approval_event.encode),
      impacted
    );

    return new collections.empty_object();
  }

  set_approval_for_all(args: collections.set_approval_for_all_arguments): collections.empty_object {
    const approver_address = args.approver_address;
    const operator_address = args.operator_address;
    const approved = args.approved;

    // only the owner of approver_address can approve an operator for his account
    System.requireAuthority(
      authority.authorization_type.contract_call,
      approver_address
    );

    // check that the approver_address is not the address to approve
    System.require(!Arrays.equal(approver_address, operator_address), "approve to operator_address", error.error_code.authorization_failure);

    // update the approval
    let approval = new collections.operator_approval_object(approved);
    this._state.saveApprovedOperator(operator_address, approver_address, approval);

    // generate event
    const approvalEvent = new collections.operator_approval_event(
      approver_address,
      operator_address,
      approved
    );
    const impacted = [operator_address, approver_address];
    System.event(
      "collections.operator_approval_event",
      Protobuf.encode(approvalEvent, collections.operator_approval_event.encode),
      impacted
    );

    return new collections.empty_object();
  }

  /**
   * Helpers
   */
  _checkOwner(config: collections.config_object): void {
    let currentOwner: Uint8Array;
    if (config.owner.length) {
      currentOwner = config.owner;
    } else {
      currentOwner = Constants.OWNER;
    }
    System.requireAuthority(authority.authorization_type.contract_call, currentOwner);
  }
}
