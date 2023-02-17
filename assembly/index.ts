import { System, Protobuf, authority } from "@koinos/sdk-as";
import { Collections as ContractClass } from "./Collections";
import { collections as ProtoNamespace } from "./proto/collections";

export function main(): i32 {
  const contractArgs = System.getArguments();
  let retbuf = new Uint8Array(1024);

  const c = new ContractClass();

  switch (contractArgs.entry_point) {
    case 0x82a3537f: {
      const args = Protobuf.decode<ProtoNamespace.name_arguments>(
        contractArgs.args,
        ProtoNamespace.name_arguments.decode
      );
      const res = c.name(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.string_object.encode);
      break;
    }

    case 0x70e5d7b6: {
      const args = Protobuf.decode<ProtoNamespace.uri_arguments>(
        contractArgs.args,
        ProtoNamespace.uri_arguments.decode
      );
      const res = c.uri(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.string_object.encode);
      break;
    }

    case 0xb76a7ca1: {
      const args = Protobuf.decode<ProtoNamespace.symbol_arguments>(
        contractArgs.args,
        ProtoNamespace.symbol_arguments.decode
      );
      const res = c.symbol(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.string_object.encode);
      break;
    }

    case 0x4c731020: {
      const args = Protobuf.decode<ProtoNamespace.get_approved_arguments>(
        contractArgs.args,
        ProtoNamespace.get_approved_arguments.decode
      );
      const res = c.get_approved(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.address_object.encode);
      break;
    }

    case 0xe7ab8ce5: {
      const args =
        Protobuf.decode<ProtoNamespace.is_approved_for_all_arguments>(
          contractArgs.args,
          ProtoNamespace.is_approved_for_all_arguments.decode
        );
      const res = c.is_approved_for_all(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.bool_object.encode);
      break;
    }

    case 0xb0da3934: {
      const args = Protobuf.decode<ProtoNamespace.total_supply_arguments>(
        contractArgs.args,
        ProtoNamespace.total_supply_arguments.decode
      );
      const res = c.total_supply(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.uint64_object.encode);
      break;
    }

    case 0x36e90cd0: {
      const args = Protobuf.decode<ProtoNamespace.royalties_arguments>(
        contractArgs.args,
        ProtoNamespace.royalties_arguments.decode
      );
      const res = c.royalties(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.royalties_result.encode);
      break;
    }

    case 0x3b5bb56b: {
      const args = Protobuf.decode<ProtoNamespace.set_royalties_arguments>(
        contractArgs.args,
        ProtoNamespace.set_royalties_arguments.decode
      );
      const res = c.set_royalties(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.empty_object.encode);
      break;
    }

    case 0x4c102969: {
      const args = Protobuf.decode<ProtoNamespace.owner_arguments>(
        contractArgs.args,
        ProtoNamespace.owner_arguments.decode
      );
      const res = c.owner(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.address_object.encode);
      break;
    }

    case 0x394be702: {
      const args = Protobuf.decode<ProtoNamespace.transfer_ownership_arguments>(
        contractArgs.args,
        ProtoNamespace.transfer_ownership_arguments.decode
      );
      const res = c.transfer_ownership(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.empty_object.encode);
      break;
    }

    case 0x5c721497: {
      const args = Protobuf.decode<ProtoNamespace.balance_of_arguments>(
        contractArgs.args,
        ProtoNamespace.balance_of_arguments.decode
      );
      const res = c.balance_of(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.uint64_object.encode);
      break;
    }

    case 0xed61c847: {
      const args = Protobuf.decode<ProtoNamespace.owner_of_arguments>(
        contractArgs.args,
        ProtoNamespace.owner_of_arguments.decode
      );
      const res = c.owner_of(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.address_object.encode);
      break;
    }

    case 0xdc6f17bb: {
      const args = Protobuf.decode<ProtoNamespace.mint_arguments>(
        contractArgs.args,
        ProtoNamespace.mint_arguments.decode
      );
      const res = c.mint(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.empty_object.encode);
      break;
    }

    case 0x859facc5: {
      const args = Protobuf.decode<ProtoNamespace.burn_arguments>(
        contractArgs.args,
        ProtoNamespace.burn_arguments.decode
      );
      const res = c.burn(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.empty_object.encode);
      break;
    }

    case 0x27f576ca: {
      const args = Protobuf.decode<ProtoNamespace.transfer_arguments>(
        contractArgs.args,
        ProtoNamespace.transfer_arguments.decode
      );
      const res = c.transfer(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.empty_object.encode);
      break;
    }

    case 0x74e21680: {
      const args = Protobuf.decode<ProtoNamespace.approve_arguments>(
        contractArgs.args,
        ProtoNamespace.approve_arguments.decode
      );
      const res = c.approve(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.empty_object.encode);
      break;
    }

    case 0x20442216: {
      const args =
        Protobuf.decode<ProtoNamespace.set_approval_for_all_arguments>(
          contractArgs.args,
          ProtoNamespace.set_approval_for_all_arguments.decode
        );
      const res = c.set_approval_for_all(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.empty_object.encode);
      break;
    }

    case 0xbd7f6850: {
      const args = Protobuf.decode<ProtoNamespace.get_info_arguments>(
        contractArgs.args,
        ProtoNamespace.get_info_arguments.decode
      );
      const res = c.get_info(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.get_info_result.encode);
      break;
    }

    default:
      System.exit(1);
      break;
  }

  System.exit(0, retbuf);
  return 0;
}

main();
