import React, { useState } from 'react';
import { Wallet } from './components/Wallet';
import { AsaInfo } from './components/AsaInfo';
import { AsaTransfer } from './components/AsaTransfer';
import { BalanceDisplay } from './components/BalanceDisplay';
import { OptInButton } from './components/OptInButton';
import { OptInStatus } from './components/OptInStatus';
import { TransactionHistory } from './components/TransactionHistory';
import { AsaInput } from './components/AsaInput';
import { ClawbackTransfer } from './components/ClawbackTransfer';
import { DestroyAsa } from './components/DestroyAsa'; 

function App() {
  const [address, setAddress] = useState('');
  const [asaId, setAsaId] = useState('');
  const [isClawback, setIsClawback] = useState(false);

  const parsedAsaId = parseInt(asaId);

  // Example logic to determine if the user is the manager
  // You may want to fetch the ASA info and compare manager address
  const [isManager, setIsManager] = useState(false);

  React.useEffect(() => {
    async function fetchManager() {
      if (!parsedAsaId || !address) {
        setIsManager(false);
        setManagerAddress('');
        return;
      }
      try {
        // Fetch ASA info to get manager address
        const algod = new (await import('algosdk')).Algodv2('', 'https://testnet-api.algonode.cloud', '');
        const asset = await algod.getAssetByID(parsedAsaId).do();
        setManagerAddress(asset.params.manager);
        setIsManager(asset.params.manager === address);
      } catch {
        setIsManager(false);
      }
    }
    fetchManager();
  }, [parsedAsaId, address]);

  return (
    <div className="min-h-screen p-6 bg-white text-gray-900">
      <h1 className="text-3xl font-bold mb-4">ASA Token Dashboard</h1>

      <Wallet onConnect={setAddress} />
      <AsaInput asaId={asaId} setAsaId={setAsaId} />

      <div className="mb-4">
        <label className="mr-2 font-semibold">Clawback Mode</label>
        <input
          type="checkbox"
          checked={isClawback}
          onChange={() => setIsClawback((prev) => !prev)}
        />
      </div>

      {address && !isNaN(parsedAsaId) && (
        <>
          <BalanceDisplay address={address} asaId={parsedAsaId} />
          <OptInStatus address={address} asaId={parsedAsaId} />
          <OptInButton sender={address} asaId={parsedAsaId} />
          <AsaTransfer sender={address} asaId={parsedAsaId} />
          <TransactionHistory address={address} asaId={parsedAsaId} />
          {isManager && (
            <DestroyAsa asaId={parsedAsaId} managerAddress={address} />
          )}
        </>
      )}

      {isClawback && (
        <ClawbackTransfer asaId={parsedAsaId} clawbackAddress={address} />
      )}

      {!isNaN(parsedAsaId) && <AsaInfo asaId={parsedAsaId} />}
    </div>
  );
}

export default App;

function setManagerAddress(arg0: string) {
  throw new Error('Function not implemented.');
}
