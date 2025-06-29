import React, { useState } from 'react';
import algosdk from 'algosdk';
import MyAlgoConnect from '@randlabs/myalgo-connect';

const algod = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');

interface Props {
  sender: string;
  asaId: number;
}

export const AsaTransfer: React.FC<Props> = ({ sender, asaId }) => {
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');

  const myAlgoWallet = new MyAlgoConnect();

  const handleTransfer = async () => {
    try {
      setStatus('Preparing transaction...');
      const params = await algod.getTransactionParams().do();

      const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: sender,
        to: receiver,
        amount: Number(amount),
        assetIndex: asaId,
        suggestedParams: params,
      });

      const signedTxn = await myAlgoWallet.signTransaction(txn.toByte());
      const { txId } = await algod.sendRawTransaction(signedTxn.blob).do();

      setStatus(`Sent! Waiting for confirmation (txId: ${txId})...`);
      await algosdk.waitForConfirmation(algod, txId, 4);

      setStatus('✅ Transfer confirmed!');
    } catch (error: any) {
      console.error(error);
      setStatus('❌ Transfer failed: ' + error.message);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded shadow-md mt-4 max-w-md">
      <h2 className="text-xl font-semibold mb-2">Transfer ASA</h2>
      <input
        type="text"
        placeholder="Receiver address"
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
        className="w-full p-2 border mb-2 rounded"
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 border mb-2 rounded"
      />
      <button
        onClick={handleTransfer}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Send Tokens
      </button>
      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>)}