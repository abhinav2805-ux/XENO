'use client';
import { useState } from 'react';

export default function CreateCampaign() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [campaignId, setCampaignId] = useState<string>('');
  const [campaignName, setCampaignName] = useState('');
  const [campaignDesc, setCampaignDesc] = useState('');
  const [step, setStep] = useState<'details' | 'upload'>('details');
  const [filterField, setFilterField] = useState('');
  const [filterValue, setFilterValue] = useState('');

  const handleCreateCampaign = async () => {
    if (!campaignName) {
      setMessage('Please enter a campaign name.');
      return;
    }
    setMessage('');
    const res = await fetch('/api/campaigns/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: campaignName, description: campaignDesc }),
      credentials: 'include',
    });
    const data = await res.json();
    if (res.ok && data.campaign?._id) {
      setCampaignId(data.campaign._id);
      setStep('upload');
      setMessage('Campaign created! Now upload your CSV.');
    } else {
      setMessage(data.message || 'Failed to create campaign');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !campaignId) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('campaignId', campaignId);

    try {
      const res = await fetch('/api/campaigns/upload-csv', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      let data;
      try {
        data = await res.json();
      } catch {
        data = { message: 'Unknown error (invalid JSON response)' };
      }
      setMessage(data.message);
      if (res.ok) fetchPreview();
    } catch (err) {
      setMessage('Network error');
    }
  };

  const fetchPreview = async (filterField?: string, filterValue?: string) => {
    if (!campaignId) return;
    let url = `/api/campaigns/preview?campaignId=${campaignId}`;
    if (filterField && filterValue) {
      url += `&filterField=${encodeURIComponent(filterField)}&filterValue=${encodeURIComponent(filterValue)}`;
    }
    const res = await fetch(url);
    const data = await res.json();
    setPreview(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow mt-8">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Create Campaign</h1>

      {step === 'details' && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Campaign Name"
            value={campaignName}
            onChange={e => setCampaignName(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-3"
          />
          <textarea
            placeholder="Campaign Description (optional)"
            value={campaignDesc}
            onChange={e => setCampaignDesc(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-3"
          />
          <button
            onClick={handleCreateCampaign}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow"
          >
            Create Campaign
          </button>
        </div>
      )}

      {step === 'upload' && (
        <>
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
        </>
      )}

      {message && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">
          {message}
        </div>
      )}

      {preview.length > 0 && (
        <div className="mt-6">
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              placeholder="Filter field (e.g. email)"
              value={filterField}
              onChange={e => setFilterField(e.target.value)}
              className="border px-2 py-1 rounded"
            />
            <input
              type="text"
              placeholder="Filter value"
              value={filterValue}
              onChange={e => setFilterValue(e.target.value)}
              className="border px-2 py-1 rounded"
            />
            <button
              onClick={() => fetchPreview(filterField, filterValue)}
              className="bg-blue-600 text-white px-4 py-1 rounded"
            >
              Apply Filter
            </button>
          </div>

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
