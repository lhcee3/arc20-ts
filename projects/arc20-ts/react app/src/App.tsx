import React, { useState } from 'react';
import { Wallet } from './components/Wallet';
import { AsaInfo } from './components/AsaInfo';
import { AsaTransfer } from './components/AsaTransfer';
import { BalanceDisplay } from './components/BalanceDisplay';
import { OptInButton } from './components/OptInButton';

function App() {
  const [address, setAddress] = useState('');

  return (
    <div className="min-h-screen p-6 bg-white text-gray-900">
      <h1 className="text-3xl font-bold mb-4">ASA Token Dashboard</h1>
      <Wallet onConnect={setAddress} />
      {address && (
        <>
          <BalanceDisplay address={address} />
          <OptInButton sender={address} />
          <AsaTransfer sender={address} />
        </>
      )}
      <AsaInfo />
    </div>
  );
}

export default App;
