'use client';
import { useEffect, useState } from 'react';

export default function CreateCampaign() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [campaignId, setCampaignId] = useState<string>('');
  const [campaignName, setCampaignName] = useState('');
  const [campaignDesc, setCampaignDesc] = useState('');
  const [step, setStep] = useState<'details' | 'upload' | 'preview'>('details');
  const [filterField, setFilterField] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [csvFields, setCsvFields] = useState<string[]>([]);

  // Fields to exclude from the table display
  const excludedFields = ['_id', 'userId', 'campaignId', 'createdAt', 'updatedAt', '__v'];

  const handleCreateCampaign = async () => {
    if (!campaignName) {
      setMessage('Please enter a campaign name.');
      return;
    }
    setIsLoading(true);
    setMessage('');
    
    try {
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
    } catch (error) {
      setMessage('Error creating campaign. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      // Clear previous messages when a new file is selected
      setMessage('');
    }
  };

  const handleUpload = async () => {
    if (!file || !campaignId) {
      setMessage('Please select a CSV file to upload.');
      return;
    }
    
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('campaignId', campaignId);
    console.log('Uploading file:', formData);

    try {
      const res = await fetch('/api/campaigns/upload-csv', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      let data;
      try {
        data = await res.json();
      } catch (error) {
        data = { message: 'Unknown error (invalid JSON response)' };
      }
      
      setMessage(data.message || 'Upload complete');
      
      if (res.ok) {
        // Store the CSV fields that were uploaded
        if (data.fields && Array.isArray(data.fields)) {
          setCsvFields(data.fields);
        }
        setStep('preview');
        await fetchPreview();
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPreview = async (field?: string, value?: string) => {
    if (!campaignId) return;
    
    setIsLoading(true);
    
    try {
      let url = `/api/campaigns/preview?campaignId=${campaignId}`;
      if (field?.trim() && value?.trim()) {
        url += `&filterField=${encodeURIComponent(field)}&filterValue=${encodeURIComponent(value)}`;
      }
      
      const res = await fetch(url);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch preview');
      }
      
      const data = await res.json();
      
      if (data.data) {
        setPreview(data.data);
        
        // Update available filter fields
        if (data.availableFields && Array.isArray(data.availableFields)) {
          setAvailableFields(data.availableFields.filter(
            (field: string) => !excludedFields.includes(field)
          ));
        } else if (data.data.length > 0) {
          // Fallback: extract fields from the first record
          const keys = Object.keys(data.data[0]).filter(
            (k) => !excludedFields.includes(k)
          );
          setAvailableFields(keys);
        }
      } else {
        setPreview(Array.isArray(data) ? data : []);
        
        if (Array.isArray(data) && data.length > 0) {
          const keys = Object.keys(data[0]).filter(
            (k) => !excludedFields.includes(k)
          );
          setAvailableFields(keys);
        }
      }
    } catch (error) {
      setMessage(`Error fetching preview: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Preview fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilter = () => {
    fetchPreview(filterField, filterValue);
  };

  const clearFilter = () => {
    setFilterField('');
    setFilterValue('');
    fetchPreview();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow my-8">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Create Campaign</h1>

      {step === 'details' && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Campaign Name"
            value={campaignName}
            onChange={e => setCampaignName(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-3"
            required
          />
          <textarea
            placeholder="Campaign Description (optional)"
            value={campaignDesc}
            onChange={e => setCampaignDesc(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-3 h-24"
          />
          <button
            onClick={handleCreateCampaign}
            disabled={isLoading || !campaignName}
            className={`${
              isLoading || !campaignName 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-semibold py-2 px-6 rounded shadow transition-colors`}
          >
            {isLoading ? 'Creating...' : 'Create Campaign'}
          </button>
        </div>
      )}

      {step === 'upload' && (
        <>
          <div className="mb-4">
            <div className="bg-blue-50 p-4 rounded-lg mb-4 text-blue-700 text-sm">
              <p className="font-semibold">Tips for CSV upload:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Make sure your CSV has a header row</li>
                <li>For best results, include at least 'email' field</li>
                <li>All columns will be imported as customer data</li>
              </ul>
            </div>
            
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
            {file && <p className="mt-2 text-sm text-gray-600">Selected: {file.name}</p>}
          </div>
          
          <div className="flex gap-3 mb-4">
            <button
              onClick={handleUpload}
              disabled={isLoading || !file}
              className={`${
                isLoading || !file
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white font-semibold py-2 px-6 rounded shadow transition-colors`}
            >
              {isLoading ? 'Uploading...' : 'Upload CSV'}
            </button>
            
            <button
              onClick={() => setStep('details')}
              className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded shadow transition-colors"
            >
              Back
            </button>
          </div>
        </>
      )}

      {message && (
        <div className={`mb-4 p-3 rounded ${
          message.toLowerCase().includes('error') || message.toLowerCase().includes('fail')
            ? 'bg-red-100 text-red-800 border border-red-300'
            : 'bg-green-100 text-green-800 border border-green-300'
        }`}>
          {message}
        </div>
      )}

      {preview.length > 0 && (
        <div className="mt-6">
          <div className="mb-4 flex flex-wrap gap-2 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Field</label>
              <select
                value={filterField}
                onChange={e => setFilterField(e.target.value)}
                className="border px-2 py-1 rounded"
              >
                <option value="">Select field</option>
                {availableFields.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
              <input
                type="text"
                placeholder="Filter value"
                value={filterValue}
                onChange={e => setFilterValue(e.target.value)}
                className="border px-2 py-1 rounded"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={applyFilter}
                disabled={!filterField || !filterValue}
                className={`${
                  !filterField || !filterValue 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white px-4 py-1 rounded text-sm`}
              >
                Apply Filter
              </button>
              
              {(filterField || filterValue) && (
                <button
                  onClick={clearFilter}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1 rounded text-sm"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <h2 className="text-lg font-semibold mb-2 text-gray-700">Preview (first 10 rows):</h2>

          {preview.length === 0 ? (
            <div className="text-gray-500 p-4 bg-gray-100 rounded">No matching data found.</div>
          ) : (
            <div className="overflow-x-auto rounded border shadow">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    {Object.keys(preview[0])
                      .filter((key) => !excludedFields.includes(key))
                      .map((key) => (
                        <th
                          key={key}
                          className="px-3 py-2 border-b bg-gray-100 text-gray-700 text-left text-sm font-medium"
                        >
                          {key}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(0, 10).map((row, idx) => (
                    <tr key={idx} className="hover:bg-blue-50">
                      {Object.entries(row)
                        .filter(([key]) => !excludedFields.includes(key))
                        .map(([key, val], i) => (
                          <td key={i} className="px-3 py-2 border-b text-sm">
                            {val !== null && val !== undefined ? String(val) : ''}
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {preview.length > 10 && (
            <div className="mt-2 text-sm text-gray-600">
              Showing 10 of {preview.length} records
            </div>
          )}
        </div>
      )}
    </div>
  );
}