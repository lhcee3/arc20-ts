import React, { useState } from 'react';
import algosdk from 'algosdk';

const algod = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');

interface Props {
  asaId: number;
  freezeAddress: string;
}

export const FreezeAccount: React.FC<Props> = ({ asaId, freezeAddress }) => {
  const [target, setTarget] = useState('');
  const [freeze, setFreeze] = useState(true);
  const [status, setStatus] = useState('');

  // TEMPORARY: Replace with secure method
  const freezeMnemonic = prompt('Enter freeze account mnemonic (for demo only)') ?? '';
  const freezeAccount = algosdk.mnemonicToSecretKey(freezeMnemonic);

  const handleFreeze = async () => {
    try {
      const params = await algod.getTransactionParams().do();

      const txn = algosdk.makeAssetFreezeTxnWithSuggestedParamsFromObject({
        from: freezeAddress,
        assetIndex: asaId,
        freezeState: freeze,
        freezeTarget: target,
        suggestedParams: params,
      });

      const signedTxn = txn.signTxn(freezeAccount.sk);
      const { txId } = await algod.sendRawTransaction(signedTxn).do();
      await algosdk.waitForConfirmation(algod, txId, 4);

      setStatus(`✅ Account ${target} was ${freeze ? 'frozen' : 'unfrozen'} successfully`);
    } catch (err: any) {
      console.error(err);
      setStatus(`❌ Freeze failed: ${err.message}`);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-md font-semibold mb-1">Freeze / Unfreeze Account</h3>
      <input
        className="border p-2 mr-2 rounded w-72"
        type="text"
        placeholder="Target address"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
      />
      <select value={freeze ? 'freeze' : 'unfreeze'} onChange={(e) => setFreeze(e.target.value === 'freeze')}>
        <option value="freeze">Freeze</option>
        <option value="unfreeze">Unfreeze</option>
      </select>
      <button
        className="ml-2 bg-red-600 text-white px-3 py-1 rounded"
        onClick={handleFreeze}
        disabled={!target}
      >
        Submit
      </button>
      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  );
};
