import { System, Protobuf, authority } from "@koinos/sdk-as";
import { collections } from "./proto/collections";

export class Collections {
  name(args: collections.name_arguments): collections.string_object {
    // YOUR CODE HERE

    const res = new collections.string_object();
    // res.value = ;

    return res;
  }

  uri(args: collections.uri_arguments): collections.string_object {
    // YOUR CODE HERE

    const res = new collections.string_object();
    // res.value = ;

    return res;
  }

  symbol(args: collections.symbol_arguments): collections.string_object {
    // YOUR CODE HERE

    const res = new collections.string_object();
    // res.value = ;

    return res;
  }

  get_approved(
    args: collections.get_approved_arguments
  ): collections.address_object {
    // const token_id = args.token_id;

    // YOUR CODE HERE

    const res = new collections.address_object();
    // res.value = ;

    return res;
  }

  is_approved_for_all(
    args: collections.is_approved_for_all_arguments
  ): collections.bool_object {
    // const owner = args.owner;
    // const operator = args.operator;

    // YOUR CODE HERE

    const res = new collections.bool_object();
    // res.value = ;

    return res;
  }

  total_supply(
    args: collections.total_supply_arguments
  ): collections.uint64_object {
    // YOUR CODE HERE

    const res = new collections.uint64_object();
    // res.value = ;

    return res;
  }

  royalties(
    args: collections.royalties_arguments
  ): collections.royalties_result {
    // YOUR CODE HERE

    const res = new collections.royalties_result();
    // res.value = ;

    return res;
  }

  set_royalties(
    args: collections.set_royalties_arguments
  ): collections.empty_object {
    // const value = args.value;

    // YOUR CODE HERE

    const res = new collections.empty_object();

    return res;
  }

  owner(args: collections.owner_arguments): collections.address_object {
    // YOUR CODE HERE

    const res = new collections.address_object();
    // res.value = ;

    return res;
  }

  transfer_ownership(
    args: collections.transfer_ownership_arguments
  ): collections.empty_object {
    // const owner = args.owner;

    // YOUR CODE HERE

    const res = new collections.empty_object();

    return res;
  }

  balance_of(
    args: collections.balance_of_arguments
  ): collections.uint64_object {
    // const owner = args.owner;

    // YOUR CODE HERE

    const res = new collections.uint64_object();
    // res.value = ;

    return res;
  }

  owner_of(args: collections.owner_of_arguments): collections.address_object {
    // const token_id = args.token_id;

    // YOUR CODE HERE

    const res = new collections.address_object();
    // res.value = ;

    return res;
  }

  mint(args: collections.mint_arguments): collections.empty_object {
    // const to = args.to;
    // const number_tokens_to_mint = args.number_tokens_to_mint;

    // YOUR CODE HERE

    const res = new collections.empty_object();

    return res;
  }

  burn(args: collections.burn_arguments): collections.empty_object {
    // const from = args.from;
    // const token_id = args.token_id;

    // YOUR CODE HERE

    const res = new collections.empty_object();

    return res;
  }

  transfer(args: collections.transfer_arguments): collections.empty_object {
    // const from = args.from;
    // const to = args.to;
    // const token_id = args.token_id;

    // YOUR CODE HERE

    const res = new collections.empty_object();

    return res;
  }

  approve(args: collections.approve_arguments): collections.empty_object {
    // const approver_address = args.approver_address;
    // const to = args.to;
    // const token_id = args.token_id;

    // YOUR CODE HERE

    const res = new collections.empty_object();

    return res;
  }

  set_approval_for_all(
    args: collections.set_approval_for_all_arguments
  ): collections.empty_object {
    // const approver_address = args.approver_address;
    // const operator_address = args.operator_address;
    // const approved = args.approved;

    // YOUR CODE HERE

    const res = new collections.empty_object();

    return res;
  }
}
