import React, { useEffect, useState } from 'react';
import algosdk from 'algosdk';

const algod = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');

interface Props {
  address: string;
  asaId: number;
}

export const OptInStatus: React.FC<Props> = ({ address, asaId }) => {
  const [optedIn, setOptedIn] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkOptIn() {
      try {
        const account = await algod.accountInformation(address).do();
        const asset = account.assets.find((a: any) => a['asset-id'] === asaId);
        setOptedIn(!!asset);
      } catch (err) {
        console.error('Opt-in check error:', err);
        setOptedIn(null);
      }
    }

    if (address && asaId) {
      checkOptIn();
    }
  }, [address, asaId]);

  return (
    <div className="mt-4">
      <span className="text-lg font-semibold">Opt-In Status: </span>
      {optedIn === null ? (
        <span>Loading...</span>
      ) : optedIn ? (
        <span className="text-green-600 font-semibold">✅ Opted In</span>
      ) : (
        <span className="text-red-600 font-semibold">❌ Not Opted In</span>
      )}
    </div>)}