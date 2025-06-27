import React, { useState } from 'react';
import MyAlgoConnect from '@randlabs/myalgo-connect';

const myAlgoWallet = new MyAlgoConnect();

export const Wallet = ({ onConnect }: { onConnect: (address: string) => void }) => {
  const [account, setAccount] = useState('');

  const connectWallet = async () => {
    try {
      const accounts = await myAlgoWallet.connect();
      const addr = accounts[0].address;
      setAccount(addr);
      onConnect(addr);
    } catch (error) {
      console.error('Wallet connect error:', error);
    }
  };

  return (
    <button
      onClick={connectWallet}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      {account ? `Connected: ${account.slice(0, 6)}...` : 'Connect Wallet'}
    </button>
  );
};
