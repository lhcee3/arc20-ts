import React, { useState } from 'react';
import algosdk from 'algosdk';
import MyAlgoConnect from '@randlabs/myalgo-connect';

const algod = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');

interface Props {
  sender: string;
  asaId: number;
}

export const OptInButton: React.FC<Props> = ({ sender, asaId }) => {
  const [status, setStatus] = useState('');

  const optIn = async () => {
    try {
      const myAlgo = new MyAlgoConnect();
      const params = await algod.getTransactionParams().do();

      const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: sender,
        to: sender,
        amount: 0,
        assetIndex: asaId,
        suggestedParams: params,
      });

      const signedTxn = await myAlgo.signTransaction(txn.toByte());
      const { txId } = await algod.sendRawTransaction(signedTxn.blob).do();
      await algosdk.waitForConfirmation(algod, txId, 4);

      setStatus('✅ Opted-in successfully!');
    } catch (e: any) {
      console.error(e);
      setStatus('❌ Opt-in failed: ' + e.message);
    }
  };

  return (
    <div className="mt-4">
      <button onClick={optIn} className="bg-yellow-500 px-4 py-2 text-white rounded">
        Opt-In to Token
      </button>
      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  );
};