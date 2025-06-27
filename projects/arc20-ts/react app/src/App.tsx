import React, { useState } from 'react';
import { TokenInfo } from './components/AsaInfo';
import { Wallet } from './components/Wallet';
import { TokenTransfer } from './components/AsaTransfer';

function App() {
  const [address, setAddress] = useState('');

  return (
    <div className="min-h-screen p-6 bg-white text-gray-900">
      <h1 className="text-3xl font-bold mb-4">ARC20 Token Dashboard</h1>
      <Wallet onConnect={setAddress} />
      {address && (
        <>
          <TokenInfo />
          <TokenTransfer sender={address} />
        </>
      )}
    </div>
  );
}

export default App;
