import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FreezeAccount } from './FreezeAccount';

const INDEXER_BASE = 'https://testnet-idx.algonode.cloud';

interface Props {
  asaId: number;
  walletAddress: string;
}

export const AdminPanel: React.FC<Props> = ({ asaId, walletAddress }) => {
  const [roles, setRoles] = useState<{ manager: string; freeze: string; clawback: string } | null>(null);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const res = await axios.get(`${INDEXER_BASE}/v2/assets/${asaId}`);
        const params = res.data.asset.params;

        setRoles({
          manager: params.manager,
          freeze: params.freeze,
          clawback: params.clawback,
        });
      } catch (err) {
        console.error('Error fetching ASA roles:', err);
      }
    }

    fetchRoles();
  }, [asaId]);

  if (!roles) return null;

  const isManager = walletAddress === roles.manager;
  const isFreeze = walletAddress === roles.freeze;
  const isClawback = walletAddress === roles.clawback;

  if (!isManager && !isFreeze && !isClawback) return null;

  return (
    <div className="mt-6 p-4 border border-red-400 bg-red-50 rounded">
      <h2 className="text-xl font-bold text-red-600 mb-2">Admin Panel</h2>
      <ul className="mb-2">
        {isManager && <li>✅ Manager</li>}
        {isFreeze && <li>✅ Freeze Manager</li>}
        {isClawback && <li>✅ Clawback</li>}
      </ul>

      {isFreeze && <FreezeAccount asaId={asaId} freezeAddress={walletAddress} />}
    </div>
  );
};
