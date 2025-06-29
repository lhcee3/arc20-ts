import React, { useEffect, useState } from 'react';
import algosdk from 'algosdk';

const algod = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');

interface Props {
  address: string;
  asaId: number;
}

export const BalanceDisplay: React.FC<Props> = ({ address, asaId }) => {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    async function fetchBalance() {
      try {
        const account = await algod.accountInformation(address).do();
        const asset = account.assets.find((a: any) => a['asset-id'] === asaId);
        if (asset) {
          const assetInfo = await algod.getAssetByID(asaId).do();
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
    if (address && asaId) {
      fetchBalance();
    }
  }, [address, asaId]);

  return (
    <div className="mt-4 text-lg">
      <strong>Balance:</strong> {balance !== null ? balance : 'Loading...'}
    </div>)}