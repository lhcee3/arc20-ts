import React, { useState } from 'react';
import MyAlgoConnect from '@algorandlabs/myalgo-connect';

const myAlgoWallet = new MyAlgoConnect();

export const Wallet = ({ onConnect }: { onConnect: (address: string) => void }) => {
  const [account, setAccount] = useState('');

  const connectWallet = async () => {
    const accounts = await myAlgoWallet.connect();
    const addr = accounts[0].address;
    setAccount(addr);
    onConnect(addr);
  };

  return (
    <button onClick={connectWallet} className="bg-blue-600 text-white p-2 rounded">
      {account ? `Connected: ${account.slice(0, 6)}...` : 'Connect Wallet'}
    </button>
  );
};
