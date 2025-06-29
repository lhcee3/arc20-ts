import React, { useState } from 'react';
import algosdk from 'algosdk';

const algod = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');

interface Props {
  asaId: number;
  clawbackAddress: string;
}

export const ClawbackTransfer: React.FC<Props> = ({ asaId, clawbackAddress }) => {
  const [fromAddr, setFromAddr] = useState('');
  const [toAddr, setToAddr] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');

  // TEMPORARY: Use a secure method in production
  const clawbackMnemonic = prompt('Enter clawback account mnemonic (for demo only)') ?? '';
  const clawbackAccount = algosdk.mnemonicToSecretKey(clawbackMnemonic);

  const handleRevoke = async () => {
    try {
      const amt = parseInt(amount);
      if (!fromAddr || !toAddr || isNaN(amt)) {
        setStatus('❌ Invalid input');
        return;
      }

      const params = await algod.getTransactionParams().do();

      const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: clawbackAddress,
        to: toAddr,
        revocationTarget: fromAddr,
        assetIndex: asaId,
        amount: amt,
        suggestedParams: params,
      });

      const signedTxn = txn.signTxn(clawbackAccount.sk);
      const { txId } = await algod.sendRawTransaction(signedTxn).do();
      await algosdk.waitForConfirmation(algod, txId, 4);

      setStatus(`✅ Clawback of ${amt} units from ${fromAddr} to ${toAddr} succeeded.`);
    } catch (err: any) {
      console.error(err);
      setStatus(`❌ Clawback failed: ${err.message}`);
    }
  };

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="text-md font-semibold mb-2 text-red-700">Clawback Transfer</h3>
      <input
        type="text"
        className="border p-2 mr-2 rounded w-72 mb-2 block"
        placeholder="From address"
        value={fromAddr}
        onChange={(e) => setFromAddr(e.target.value)}
      />
      <input
        type="text"
        className="border p-2 mr-2 rounded w-72 mb-2 block"
        placeholder="To address"
        value={toAddr}
        onChange={(e) => setToAddr(e.target.value)}
      />
      <input
        type="number"
        className="border p-2 mr-2 rounded w-72 mb-2 block"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        className="bg-red-600 text-white px-4 py-2 rounded"
        onClick={handleRevoke}
        disabled={!fromAddr || !toAddr || !amount}
      >
        Submit Clawback
      </button>
      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  );
};
