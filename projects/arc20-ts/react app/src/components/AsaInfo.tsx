import React, { useEffect, useState } from 'react';
import algosdk from 'algosdk';

const algod = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');
const ASA_ID = 12345678; // Replace with your actual ASA ID

export const AsaInfo = () => {
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    async function fetchAsset() {
      const asset = await algod.getAssetByID(ASA_ID).do();
      setInfo(asset.params);
    }
    fetchAsset();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded shadow-md w-fit mt-4">
      <h2 className="text-xl font-semibold mb-2">ASA Token Info</h2>
      {info ? (
        <ul>
          <li><strong>Name:</strong> {info.name}</li>
          <li><strong>Symbol:</strong> {info['unit-name']}</li>
          <li><strong>Total Supply:</strong> {info.total / 10 ** info.decimals}</li>
          <li><strong>Decimals:</strong> {info.decimals}</li>
          <li><strong>Manager:</strong> {info.manager}</li>
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
