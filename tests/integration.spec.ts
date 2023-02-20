/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Contract, LocalKoinos, Serializer, utils } from '@roamin/local-koinos';

import * as abi from '../abi/collections-abi.json';

// @ts-ignore koilib_types is needed when using koilib
abi.koilib_types = abi.types;

jest.setTimeout(600000);

const serializer = new Serializer(abi.types);

let localKoinos = new LocalKoinos();

if (process.env.ENV === 'LOCAL') {
  localKoinos = new LocalKoinos({
    rpc: 'http://host.docker.internal:8080',
    amqp: 'amqp://host.docker.internal:5672'
  });
}

const [
  genesis,
  koin,
  collectionsAcct,
  user1,
  user2,
  user3,
  user4,
] = localKoinos.getAccounts();

let collectionsContract: Contract;

beforeAll(async () => {
  // start local-koinos node
  await localKoinos.startNode();

  await localKoinos.deployKoinContract({ mode: 'manual' });
  await localKoinos.mintKoinDefaultAccounts({ mode: 'manual' });
  await localKoinos.deployNameServiceContract({ mode: 'manual' });
  await localKoinos.setNameServiceRecord('koin', koin.address, { mode: 'manual' });

  // deploy collections contract 
  collectionsContract = await localKoinos.deployContract(
    collectionsAcct.wif,
    './build/release/contract.wasm',
    // @ts-ignore abi is compatible
    abi,
    { mode: 'manual' },
  );

  await localKoinos.startBlockProduction();
});

afterAll(async () => {
  // stop local-koinos node
  await localKoinos.stopNode();
});

function encodeHex(str: string) {
  return `0x${Buffer.from(str, 'utf-8').toString('hex')}`;
}

describe('mint', () => {
  it('should mint a token', async () => {
    let res = await collectionsContract.functions.mint({
      to: user1.address,
      number_tokens_to_mint: '1'
    });

    await res.transaction.wait();

    // check events are emitted
    let eventName = 'collections.mint_event';
    expect(res.receipt.events).toEqual(expect.arrayContaining([
      {
        source: collectionsContract.getId(),
        name: eventName,
        data: 'ChkA7IVnjhHPBtM8qmxD2Bzl1Yx1kqpjau1JEgEx',
        impacted: [user1.address]
      }
    ]));
    let eventData = await serializer.deserialize(res.receipt.events[0].data, eventName);
    expect(eventData.to).toEqual(user1.address);
    expect(eventData.token_id).toEqual(encodeHex('1'));

    // check total supply
    res = await collectionsContract.functions.total_supply({
    });

    expect(res.result.value).toEqual('1');

    // check balance
    res = await collectionsContract.functions.balance_of({
      owner: user1.address
    });

    expect(res.result.value).toEqual('1');

    // check owner
    res = await collectionsContract.functions.owner_of({
      token_id: encodeHex('1')
    });

    expect(res.result.value).toEqual(user1.address);

    // mint another token

    res = await collectionsContract.functions.mint({
      to: user2.address,
      number_tokens_to_mint: '1'
    });

    await res.transaction.wait();

    // check events are emitted
    eventName = 'collections.mint_event';
    expect(res.receipt.events).toEqual(expect.arrayContaining([
      {
        source: collectionsContract.getId(),
        name: eventName,
        data: 'ChkAtXz8xYEm6uP6ZnBQ0Q5y549qqot9ZSwJEgEy',
        impacted: [user2.address]
      }
    ]));

    eventData = await serializer.deserialize(res.receipt.events[0].data, eventName);
    expect(eventData.to).toEqual(user2.address);
    expect(eventData.token_id).toEqual(encodeHex('2'));

    // check total_supply
    res = await collectionsContract.functions.total_supply({
    });

    expect(res.result.value).toEqual('2');

    // check balance
    res = await collectionsContract.functions.balance_of({
      owner: user2.address
    });

    expect(res.result.value).toEqual('1');

    // check owner
    res = await collectionsContract.functions.owner_of({
      token_id: encodeHex('2')
    });

    expect(res.result.value).toEqual(user2.address);

  });
});

describe('transfer', () => {
  it('should transfer a token', async () => {
    // transfer token 1 to user2
    let res = await collectionsContract.functions.transfer({
      from: user1.address,
      to: user2.address,
      token_id: encodeHex('1')
    }, {
      beforeSend: async (tx) => {
        await user1.signer.signTransaction(tx);
      }
    });

    await res.transaction.wait();

    // check events are emitted
    let eventName = 'collections.transfer_event';
    expect(res.receipt.events).toEqual(expect.arrayContaining([
      {
        source: collectionsContract.getId(),
        name: eventName,
        data: 'ChkA7IVnjhHPBtM8qmxD2Bzl1Yx1kqpjau1JEhkAtXz8xYEm6uP6ZnBQ0Q5y549qqot9ZSwJGgEx',
        impacted: [user2.address, user1.address]
      }
    ]));

    let eventData = await serializer.deserialize(res.receipt.events[0].data, eventName);
    expect(eventData.from).toEqual(user1.address);
    expect(eventData.to).toEqual(user2.address);
    expect(eventData.token_id).toEqual(encodeHex('1'));

    // check balances
    res = await collectionsContract.functions.balance_of({
      owner: user1.address
    });

    expect(res.result).toBeUndefined();

    res = await collectionsContract.functions.balance_of({
      owner: user2.address
    });

    expect(res.result.value).toEqual('2');

    // check owner
    res = await collectionsContract.functions.owner_of({
      token_id: encodeHex('1')
    });

    expect(res.result.value).toEqual(user2.address);
  });
});

