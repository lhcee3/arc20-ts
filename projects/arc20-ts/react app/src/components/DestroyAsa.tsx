import React, { useState } from 'react';
import algosdk from 'algosdk';

const algod = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');

interface Props {
  asaId: number;
  managerAddress: string;
}

export const DestroyAsa: React.FC<Props> = ({ asaId, managerAddress }) => {
  const [status, setStatus] = useState('');

  // TEMPORARY: Use secure signing in production
  const managerMnemonic = prompt('Enter manager account mnemonic (for demo only)') ?? '';
  const managerAccount = algosdk.mnemonicToSecretKey(managerMnemonic);

  const destroyAsset = async () => {
    try {
      const params = await algod.getTransactionParams().do();

      const txn = algosdk.makeAssetDestroyTxnWithSuggestedParamsFromObject({
        from: managerAddress,
        assetIndex: asaId,
        suggestedParams: params,
      });

      const signedTxn = txn.signTxn(managerAccount.sk);
      const { txId } = await algod.sendRawTransaction(signedTxn).do();
      await algosdk.waitForConfirmation(algod, txId, 4);

      setStatus(`✅ ASA ${asaId} destroyed successfully. TXID: ${txId}`);
    } catch (err: any) {
      console.error(err);
      setStatus(`❌ Failed to destroy ASA: ${err.message}`);
    }
  };

    const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="mt-6 border-t pt-4">
      <button
        className="bg-black text-white px-4 py-2 rounded"
        onClick={() => setShowConfirm(true)}
      >
        🔥 Destroy ASA
      </button>
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="mb-4">Are you sure you want to permanently destroy this ASA?</p>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded mr-2"
              onClick={() => {
                setShowConfirm(false);
                destroyAsset();
              }}
            >
              Yes, Destroy
            </button>
            <button
              className="bg-gray-300 px-4 py-2 rounded"
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  );
};
// Note: This component allows the manager to destroy an ASA. Use with caution as this action is irreversible.
