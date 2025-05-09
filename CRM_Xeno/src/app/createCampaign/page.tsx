'use client';
import { useState } from 'react';

export default function CreateCampaign({ campaignId }: { campaignId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('campaignId', campaignId);

    const res = await fetch('http://localhost:5000/api/campaigns/upload-csv', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });
    const data = await res.json();
    setMessage(data.message);
    fetchPreview();
  };

  const fetchPreview = async () => {
    const res = await fetch(`http://localhost:5000/api/campaigns/preview?campaignId=${campaignId}`);
    const data = await res.json();
    setPreview(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow mt-8">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Create Campaign</h1>
      <div className="mb-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>
      <button
        onClick={handleUpload}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow mb-4 transition-colors"
      >
        Upload CSV
      </button>
      {message && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">
          {message}
        </div>
      )}
      {preview.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Preview (first 10 rows):</h2>
          <div className="overflow-x-auto rounded border">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  {Object.keys(preview[0]).map((key) => (
                    <th key={key} className="px-3 py-2 border-b bg-gray-100 text-gray-700 text-left">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 10).map((row, idx) => (
                  <tr key={idx} className="hover:bg-blue-50">
                    {Object.values(row).map((val, i) => (
                      <td key={i} className="px-3 py-2 border-b">{val as string}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}