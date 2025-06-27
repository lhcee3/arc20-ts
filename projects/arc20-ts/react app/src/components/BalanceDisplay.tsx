import React, { useEffect, useState } from 'react';
import algosdk from 'algosdk';

const algod = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');
const ASA_ID = 12345678;

export const BalanceDisplay = ({ address }: { address: string }) => {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    async function fetchBalance() {
      try {
        const account = await algod.accountInformation(address).do();
        const asset = account.assets.find((a: any) => a['asset-id'] === ASA_ID);
        if (asset) {
          const assetInfo = await algod.getAssetByID(ASA_ID).do();
          const decimals = assetInfo.params.decimals;
          setBalance(asset.amount / Math.pow(10, decimals));
        } else {
          setBalance(0);
        }
      } catch (err) {
        console.error('Error fetching balance:', err);
        setBalance(null);
      }
    }
    fetchBalance();
  }, [address]);

  return (
    <div className="mt-4 text-lg">
      <strong>Balance:</strong> {balance !== null ? balance : 'Loading...'}
    </div>
  );
};
