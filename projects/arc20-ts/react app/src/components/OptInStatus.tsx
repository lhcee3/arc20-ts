import React, { useEffect, useState } from 'react';
import algosdk from 'algosdk';

const algod = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');
const ASA_ID = 12345678; // Replace with your actual ASA ID

export const OptInStatus = ({ address }: { address: string }) => {
  const [optedIn, setOptedIn] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkOptIn() {
      try {
        const account = await algod.accountInformation(address).do();
        const asset = account.assets.find((a: any) => a['asset-id'] === ASA_ID);
        setOptedIn(!!asset);
      } catch (err) {
        console.error('Opt-in check error:', err);
        setOptedIn(null);
      }
    }

    checkOptIn();
  }, [address]);

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
    </div>
  );
};
