import React, { useEffect, useState } from 'react';
import { ARC20_APP_ID, getGlobalState } from '';

export const TokenInfo = () => {
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const state = await getGlobalState(ARC20_APP_ID);
      setTokenInfo(state);
    }

    fetchData();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded shadow-md w-fit">
      <h2 className="text-xl font-semibold mb-2">Token Info</h2>
      {tokenInfo ? (
        <ul>
          <li><strong>Name:</strong> {Buffer.from(tokenInfo['name'], 'base64').toString()}</li>
          <li><strong>Symbol:</strong> {Buffer.from(tokenInfo['symbol'], 'base64').toString()}</li>
          <li><strong>Total Supply:</strong> {tokenInfo['total_supply']}</li>
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
