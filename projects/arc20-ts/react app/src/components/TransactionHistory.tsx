import React, { useEffect, useState } from 'react';
import axios from 'axios';

const INDEXER_BASE = 'https://testnet-idx.algonode.cloud';

interface Txn {
  id: string;
  round: number;
  timestamp: number;
  sender: string;
  receiver: string;
  amount: number;
}

interface Props {
  address: string;
  asaId: number;
}

export const TransactionHistory: React.FC<Props> = ({ address, asaId }) => {
  const [txns, setTxns] = useState<Txn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTxns() {
      setLoading(true);
      try {
        const res = await axios.get(
          `${INDEXER_BASE}/v2/accounts/${address}/transactions`,
          {
            params: {
              asset_id: asaId,
              limit: 5,
              'tx-type': 'axfer',
            },
          }
        );

        const parsed: Txn[] = res.data.transactions.map((tx: any) => ({
          id: tx.id,
          round: tx['confirmed-round'],
          timestamp: tx['round-time'],
          sender: tx.sender,
          receiver: tx['asset-transfer-transaction'].receiver,
          amount: tx['asset-transfer-transaction'].amount,
        }));

        setTxns(parsed);
        setLoading(false);
      } catch (err) {
        console.error('Txn history error:', err);
        setLoading(false);
      }
    }

    if (address && asaId) {
      fetchTxns();
    }
  }, [address, asaId]);

  return (
    <div className="mt-6 p-4 bg-gray-100 rounded shadow-md max-w-2xl">
      <h2 className="text-xl font-semibold mb-2">Recent ASA Transactions</h2>
      {loading ? (
        <p>Loading transactions...</p>
      ) : txns.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <ul className="space-y-2">
          {txns.map((tx) => (
            <li key={tx.id} className="text-sm border-b pb-1">
              <strong>From:</strong> {tx.sender.slice(0, 6)}... → <strong>To:</strong> {tx.receiver.slice(0, 6)}...
              <br />
              <strong>Amount:</strong> {tx.amount}
              <br />
              <strong>Round:</strong> {tx.round}
              <br />
              <a
                href={`https://testnet.algoexplorer.io/tx/${tx.id}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                View on AlgoExplorer
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};