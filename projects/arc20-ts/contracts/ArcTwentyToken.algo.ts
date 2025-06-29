import {
  Algodv2,
  Account,
  waitForConfirmation,
  makeAssetConfigTxnWithSuggestedParamsFromObject,
  makeAssetTransferTxnWithSuggestedParamsFromObject,
  SuggestedParams,
  Transaction,
} from 'algosdk';

// Define error messages
const err = {
  MISSING_CTRL_ASA: 'Missing control ASA',
  INVALID_CTRL_ASA: 'Invalid control ASA',
  EXISTING_CTRL_ASA: 'Existing control ASA',
};

// Type for Algorand asset parameters (based on Algorand REST API)
export interface AssetParams {
  creator: string;
  total: number;
  decimals: number;
  defaultFrozen: boolean;
  unitName: string;
  name: string;
  url: string;
  metadataHash: string;
  manager: string;
  reserve: string;
  freeze: string;
  clawback: string;
  [key: string]: unknown; // For any extra fields
}

// Type for asset info response
export interface AssetInfo {
  index: number;
  params: AssetParams;
}

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

    const params: SuggestedParams = await this.algodClient.getTransactionParams().do();

    const txn: Transaction = makeAssetConfigTxnWithSuggestedParamsFromObject({
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
    const assetId: number = confirmedTxn['asset-index'];

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

    const params: SuggestedParams = await this.algodClient.getTransactionParams().do();

    const txn: Transaction = makeAssetTransferTxnWithSuggestedParamsFromObject({
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
    const params: SuggestedParams = await this.algodClient.getTransactionParams().do();

    const txn: Transaction = makeAssetTransferTxnWithSuggestedParamsFromObject({
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

    const params: SuggestedParams = await this.algodClient.getTransactionParams().do();

    const txn: Transaction = makeAssetConfigTxnWithSuggestedParamsFromObject({
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

  /**
   * Fetch asset information from the blockchain.
   * @param assetId The asset ID to fetch info for.
   * @returns Asset parameters object from the blockchain.
   */
  async fetchAssetInfo(assetId: number): Promise<AssetInfo> {
    try {
      const assetInfo = await this.algodClient.getAssetByID(assetId).do();
      return assetInfo as AssetInfo;
    } catch (error) {
      throw new Error(`Failed to fetch asset info: ${error}`);
    }
  }

  /**
   * Destroy the asset (must be called by the manager).
   * @param assetId The asset ID to destroy.
   */
  async destroyAsset(assetId: number): Promise<void> {
    this.assertCommonPreconditions(assetId);

    const params: SuggestedParams = await this.algodClient.getTransactionParams().do();

    const txn: Transaction = makeAssetConfigTxnWithSuggestedParamsFromObject({
      from: this.manager.addr,
      assetIndex: assetId,
      manager: '',
      reserve: '',
      freeze: '',
      clawback: '',
      strictEmptyAddressChecking: false,
      suggestedParams: params,
    });

    const signedTxn = txn.signTxn(this.manager.sk);
    const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();
    await waitForConfirmation(this.algodClient, txId, 4);
    this.smartAsaId = 0;
  }

  /**
   * Freeze an account's asset holding.
   * @param assetId The asset ID.
   * @param targetAddr The address to freeze.
   */
  // targetAddr parameter is currently unused; remove to avoid compile error
  async freezeAsset(assetId: number): Promise<void> {
    this.assertCommonPreconditions(assetId);

    // Placeholder for freeze transaction creation
    // const params: SuggestedParams = await this.algodClient.getTransactionParams().do();
    // const txn = algosdk.makeAssetFreezeTxnWithSuggestedParamsFromObject({
    //   from: this.freeze,
    //   assetIndex: assetId,
    //   freezeTarget: targetAddr,
    //   freezeState: true,
    //   suggestedParams: params,
    // });
    // You need to provide the freeze account's secret key to sign the transaction.
    // For now, this is left as a placeholder.
    // const signedTxn = txn.signTxn(freezeAccount.sk);
    // const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();
    // await waitForConfirmation(this.algodClient, txId, 4);
  }

  /**
   * Unfreeze an account's asset holding.
   * @param assetId The asset ID.
   */
  async unfreezeAsset(assetId: number): Promise<void> {
    this.assertCommonPreconditions(assetId);

    // Placeholder for unfreeze transaction creation
    // const txn = algosdk.makeAssetFreezeTxnWithSuggestedParamsFromObject({
    //   from: this.freeze,
    //   assetIndex: assetId,
    //   freezeTarget: targetAddr,
    //   freezeState: false,
    //   suggestedParams: params,
    // });

    // You need to provide the freeze account's secret key to sign the transaction.
    // For now, this is left as a placeholder.
    // const signedTxn = txn.signTxn(freezeAccount.sk);
    // const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();
    // await waitForConfirmation(this.algodClient, txId, 4);
    // Placeholder: implement signing and sending the transaction as needed.
  }

  /**
   * Change the manager address for the asset.
   * @param assetId The asset ID.
   * @param newManager The new manager account.
   */
  async changeManager(
    assetId: number,
    newManager: Account,
    reserveAddr: string,
    freezeAddr: string,
    clawbackAddr: string
  ): Promise<void> {
    this.assertCommonPreconditions(assetId);

    const params: SuggestedParams = await this.algodClient.getTransactionParams().do();

    const txn: Transaction = makeAssetConfigTxnWithSuggestedParamsFromObject({
      from: this.manager.addr,
      assetIndex: assetId,
      manager: newManager.addr,
      reserve: reserveAddr,
      freeze: freezeAddr,
      clawback: clawbackAddr,
      suggestedParams: params,
      strictEmptyAddressChecking: false,
    });

    const signedTxn = txn.signTxn(this.manager.sk);
    const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();
    await waitForConfirmation(this.algodClient, txId, 4);

    this.manager = newManager;
    this.reserve = reserveAddr;
    this.freeze = freezeAddr;
    this.clawback = clawbackAddr;
  }

  /**
   * Check if an account has opted in to the asset.
   * @param assetId The asset ID.
   * @param address The address to check.
   * @returns True if opted in, false otherwise.
   */
  async hasOptedIn(assetId: number, address: string): Promise<boolean> {
    try {
      const accountInfo = await this.algodClient.accountInformation(address).do();
      return (accountInfo.assets || []).some((a: { 'asset-id': number }) => a['asset-id'] === assetId);
    } catch {
      return false;
    }
  }
}

export default SmartASA;

// This function is not needed because changeManager is already implemented as a method in the SmartASA class above.
// If you want a standalone function (not a class method), you could implement it like this:

/**
 * Change the manager address for an Algorand asset.
 * @param algodClient The Algodv2 client instance.
 * @param assetId The asset ID.
 * @param currentManager The current manager account.
 * @param newManagerAddr The new manager address.
 * @param reserveAddr The reserve address.
 * @param freezeAddr The freeze address.
 * @param clawbackAddr The clawback address.
 */
export async function changeManager(
  algodClient: Algodv2,
  assetId: number,
  currentManager: Account,
  newManagerAddr: string,
  reserveAddr: string,
  freezeAddr: string,
  clawbackAddr: string
): Promise<void> {
  const params: SuggestedParams = await algodClient.getTransactionParams().do();

  const txn: Transaction = makeAssetConfigTxnWithSuggestedParamsFromObject({
    from: currentManager.addr,
    assetIndex: assetId,
    manager: newManagerAddr,
    reserve: reserveAddr,
    freeze: freezeAddr,
    clawback: clawbackAddr,
    suggestedParams: params,
    strictEmptyAddressChecking: false,
  });

  const signedTxn = txn.signTxn(currentManager.sk);
  const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
  await waitForConfirmation(algodClient, txId, 4);
}
