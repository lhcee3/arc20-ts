import React from 'react';

interface Props {
  asaId: string;
  setAsaId: (id: string) => void;
}

export const AsaInput: React.FC<Props> = ({ asaId, setAsaId }) => {
  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">ASA ID</label>
      <input
        type="text"
        value={asaId}
        onChange={(e) => setAsaId(e.target.value)}
        placeholder="Enter ASA ID"
        className="w-64 p-2 border border-gray-300 rounded"
      />
    </div>
  );
};
