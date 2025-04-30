import {
  Algodv2,
  Account,
  waitForConfirmation,
  makeAssetConfigTxnWithSuggestedParamsFromObject,
  makeAssetTransferTxnWithSuggestedParamsFromObject,
} from 'algosdk';

// Define error messages
const err = {
  MISSING_CTRL_ASA: 'Missing control ASA',
  INVALID_CTRL_ASA: 'Invalid control ASA',
  EXISTING_CTRL_ASA: 'Existing control ASA',
};

class SmartASA {
  algodClient: Algodv2;

  smartAsaId: number;

  total: number;

  decimals: number;

  defaultFrozen: boolean;

  unitName: string;

  name: string;

  url: string;

  metadataHash: string;

  manager: Account;

  reserve: string;

  freeze: string;

  clawback: string;

  constructor(algodClient: Algodv2, manager: Account) {
    this.algodClient = algodClient;
    this.smartAsaId = 0;
    this.total = 0;
    this.decimals = 0;
    this.defaultFrozen = false;
    this.unitName = '';
    this.name = '';
    this.url = '';
    this.metadataHash = '';
    this.manager = manager;
    this.reserve = '';
    this.freeze = '';
    this.clawback = '';
  }

  assertCommonPreconditions(assetId: number): void {
    if (this.smartAsaId === 0) throw new Error(err.MISSING_CTRL_ASA);
    if (this.smartAsaId !== assetId) throw new Error(err.INVALID_CTRL_ASA);
  }

  circulatingSupply(): number {
    return 0; // Placeholder logic
  }

  async assetCreate(
    total: number,
    decimals: number,
    defaultFrozen: boolean,
    unitName: string,
    name: string,
    url: string,
    metadataHash: string,
    reserveAddr: string,
    freezeAddr: string,
    clawbackAddr: string
  ): Promise<number> {
    if (this.smartAsaId !== 0) throw new Error(err.EXISTING_CTRL_ASA);

    const params = await this.algodClient.getTransactionParams().do();

    const txn = makeAssetConfigTxnWithSuggestedParamsFromObject({
      from: this.manager.addr,
      manager: this.manager.addr,
      reserve: reserveAddr,
      freeze: freezeAddr,
      clawback: clawbackAddr,
      suggestedParams: params,
      assetIndex: 0,
      strictEmptyAddressChecking: false,
    });

    const signedTxn = txn.signTxn(this.manager.sk);
    const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();

    const confirmedTxn = await waitForConfirmation(this.algodClient, txId, 4);
    const assetId = confirmedTxn['asset-index'];

    this.smartAsaId = assetId;
    this.total = total;
    this.decimals = decimals;
    this.defaultFrozen = defaultFrozen;
    this.unitName = unitName;
    this.name = name;
    this.url = url;
    this.metadataHash = metadataHash;
    this.reserve = reserveAddr;
    this.freeze = freezeAddr;
    this.clawback = clawbackAddr;

    return assetId;
  }

  async assetOptIn(assetId: number, account: Account): Promise<void> {
    this.assertCommonPreconditions(assetId);

    const params = await this.algodClient.getTransactionParams().do();

    const txn = makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: account.addr,
      to: account.addr,
      amount: 0,
      assetIndex: assetId,
      suggestedParams: params,
    });

    const signedTxn = txn.signTxn(account.sk);
    const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();
    await waitForConfirmation(this.algodClient, txId, 4);
  }

  async assetTransfer(assetId: number, amount: number, sender: Account, receiver: string): Promise<void> {
    const params = await this.algodClient.getTransactionParams().do();

    const txn = makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: sender.addr,
      to: receiver,
      amount,
      assetIndex: assetId,
      suggestedParams: params,
    });

    const signedTxn = txn.signTxn(sender.sk);
    const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();
    await waitForConfirmation(this.algodClient, txId, 4);
  }

  async assetConfig(
    assetId: number,
    total: number,
    decimals: number,
    defaultFrozen: boolean,
    unitName: string,
    name: string,
    url: string,
    metadataHash: string,
    reserveAddr: string,
    freezeAddr: string,
    clawbackAddr: string
  ): Promise<void> {
    this.assertCommonPreconditions(assetId);

    const params = await this.algodClient.getTransactionParams().do();

    const txn = makeAssetConfigTxnWithSuggestedParamsFromObject({
      from: this.manager.addr,
      assetIndex: assetId,
      manager: this.manager.addr,
      reserve: reserveAddr,
      freeze: freezeAddr,
      clawback: clawbackAddr,
      suggestedParams: params,
      strictEmptyAddressChecking: false,
    });

    const signedTxn = txn.signTxn(this.manager.sk);
    const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();
    await waitForConfirmation(this.algodClient, txId, 4);
  }
}

export default SmartASA;
