import React, { useState } from 'react';
import { Wallet } from './components/Wallet';
import { AsaInfo } from './components/AsaInfo';
import { AsaTransfer } from './components/AsaTransfer';
import { BalanceDisplay } from './components/BalanceDisplay';
import { OptInButton } from './components/OptInButton';
import { OptInStatus } from './components/OptInStatus';
import { TransactionHistory } from './components/TransactionHistory';
import { AsaInput } from './components/AsaInput';


function App() {
  const [address, setAddress] = useState('');
  const [asaId, setAsaId] = useState('');

  const parsedAsaId = parseInt(asaId);

  return (
    <div className="min-h-screen p-6 bg-white text-gray-900">
      <h1 className="text-3xl font-bold mb-4">ASA Token Dashboard</h1>

      <Wallet onConnect={setAddress} />
      <AsaInput asaId={asaId} setAsaId={setAsaId} />

      {address && !isNaN(parsedAsaId) && (
        <>
          <BalanceDisplay address={address} asaId={parsedAsaId} />
          <OptInStatus address={address} asaId={parsedAsaId} />
          <OptInButton sender={address} asaId={parsedAsaId} />
          <AsaTransfer sender={address} asaId={parsedAsaId} />
          <TransactionHistory address={address} asaId={parsedAsaId} />
        </>
      )}

      {!isNaN(parsedAsaId) && <AsaInfo asaId={parsedAsaId} />}
    </div>
  );
}

export default App;