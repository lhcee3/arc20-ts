import { Algodv2, SuggestedParams, Transaction, Account } from 'algosdk';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import SmartASA from '../contracts/ArcTwentyToken.algo';

const dummyParams: SuggestedParams = {
  fee: 1000,
  firstRound: 1,
  lastRound: 1000,
  genesisHash: '',
  genesisID: '',
  flatFee: true,
};

const dummyAccount: Account = {
  addr: 'SOME_MANAGER_ADDRESS',
  sk: new Uint8Array(64), // dummy private key
};

describe('SmartASA', () => {
  let mockAlgod: Partial<Algodv2>;
  let smartAsa: SmartASA;

  beforeEach(() => {
    mockAlgod = {
      getTransactionParams: jest.fn().mockReturnValue({
        do: jest.fn().mockResolvedValue(dummyParams),
      }),
      sendRawTransaction: jest.fn().mockReturnValue({
        do: jest.fn().mockResolvedValue({ txId: 'ABC123' }),
      }),
      getAssetByID: jest.fn().mockReturnValue({
        do: jest.fn().mockResolvedValue({
          index: 1234,
          params: {
            creator: 'SOME_MANAGER_ADDRESS',
            total: 1000,
            decimals: 0,
            defaultFrozen: false,
            unitName: 'TEST',
            name: 'TestToken',
            url: '',
            metadataHash: '',
            manager: 'SOME_MANAGER_ADDRESS',
            reserve: '',
            freeze: '',
            clawback: '',
          },
        }),
      }),
    };

    smartAsa = new SmartASA(mockAlgod as unknown as Algodv2, dummyAccount);
  };

  it('should initialize with default values', () => {
    expect(smartAsa.smartAsaId).toBe(0);
    expect(smartAsa.name).toBe('');
  });

  it('should set smartAsaId after asset creation', async () => {
    // Override internal signTxn + waitForConfirmation
    const fakeTxn = {
      signTxn: jest.fn().mockReturnValue(new Uint8Array([1, 2, 3])),
    } as unknown as Transaction;

    jest.spyOn(require('algosdk'), 'makeAssetConfigTxnWithSuggestedParamsFromObject').mockReturnValue(fakeTxn);

    jest.spyOn(require('algosdk'), 'waitForConfirmation').mockResolvedValue({ 'asset-index': 9999 });

    const id = await smartAsa.assetCreate(1000000, 0, false, 'TKN', 'TestToken', '', '', '', '');

    expect(id).toBe(9999);
    expect(smartAsa.smartAsaId).toBe(9999);
  });

  it('should fetch asset info from algod', async () => {
    const info = await smartAsa.fetchAssetInfo(1234);
    expect(info.index).toBe(1234);
    expect(info.params.creator).toBe('SOME_MANAGER_ADDRESS');
  });

  it('should throw error on asset mismatch', () => {
    smartAsa['smartAsaId'] = 100;
    expect(() => smartAsa.assertCommonPreconditions(200)).toThrow('Invalid control ASA');
  });
});
