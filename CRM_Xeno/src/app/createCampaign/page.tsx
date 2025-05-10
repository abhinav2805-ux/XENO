'use client';
import { useState } from 'react';
import { QueryBuilder, RuleGroupType } from 'react-querybuilder';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultFields = [
  { name: 'spend', label: 'Spend', inputType: 'number' },
  { name: 'visits', label: 'Visits', inputType: 'number' },
  { name: 'inactiveDays', label: 'Inactive Days', inputType: 'number' },
  { name: 'email', label: 'Email', inputType: 'text' },
  { name: 'name', label: 'Name', inputType: 'text' },
  // Add more fields as needed
];

export default function CreateCampaign() {
  const [step, setStep] = useState<'details' | 'upload' | 'rules' | 'preview'>('details');
  const [customMessage, setCustomMessage] = useState('Hi {{name}}, here’s 10% off on your next order!');
  const [campaignName, setCampaignName] = useState('');
  const [campaignDesc, setCampaignDesc] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [csvFields, setCsvFields] = useState<string[]>([]);
  const [fields, setFields] = useState(defaultFields);
  const [query, setQuery] = useState<RuleGroupType>({ combinator: 'and', rules: [] });
  const [preview, setPreview] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Step 1: Create campaign
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

  // Step 2: Upload CSV
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
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
    try {
      const res = await fetch('/api/campaigns/upload-csv', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      let data;
      try {
        data = await res.json();
      } catch {
        data = { message: 'Unknown error (invalid JSON response)' };
      }
      setMessage(data.message || 'Upload complete');
      if (res.ok) {
        // Use CSV fields for rule builder
        if (data.fields && Array.isArray(data.fields)) {
          setCsvFields(data.fields);
          setFields([
            ...defaultFields,
            ...data.fields
              .filter(f => !defaultFields.some(df => df.name === f))
              .map(f => ({ name: f, label: f, inputType: 'text' })),
          ]);
        }
        setStep('rules');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Preview audience with rules
  const fetchPreview = async () => {
    if (!campaignId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/campaigns/preview?campaignId=${campaignId}&rules=${encodeURIComponent(JSON.stringify(query))}`);
      const data = await res.json();
      setPreview(data.data || []);
      setStep('preview');
    } catch (err) {
      setMessage('Error fetching preview.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 4: Send campaign
  const handleSend = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/campaigns/send', {
        method: 'POST',
        body: JSON.stringify({
          campaignId,
          customers: preview,
          message: customMessage,
          filters: query // pass filters to backend
        }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Campaign sent successfully!', { position: 'bottom-right' });
        setTimeout(() => router.push('/dashboard'), 2000); // Redirect after 2s
      } else {
        toast.error(data.message || 'Failed to send campaign', { position: 'bottom-right' });
      }
    } catch (err) {
      toast.error('Error sending campaign.', { position: 'bottom-right' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow my-8">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Create Campaign</h1>
      {step === 'details' && (
        <div>
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
            className="bg-blue-600 text-white font-semibold py-2 px-6 rounded shadow"
          >
            {isLoading ? 'Creating...' : 'Create Campaign'}
          </button>
        </div>
      )}

      {step === 'upload' && (
        <div>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500"
          />
          <button
            onClick={handleUpload}
            disabled={isLoading || !file}
            className="bg-blue-600 text-white font-semibold py-2 px-6 rounded shadow mt-2"
          >
            {isLoading ? 'Uploading...' : 'Upload CSV'}
          </button>
        </div>
      )}

      {step === 'rules' && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Define Audience Segment</h2>
          <QueryBuilder
            fields={fields}
            query={query}
            onQueryChange={setQuery}
          />
          <button
            onClick={fetchPreview}
            className="bg-blue-600 text-white font-semibold py-2 px-6 rounded shadow mt-4"
          >
            Preview Audience
          </button>
        </div>
      )}

      {step === 'preview' && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Audience Preview</h2>
           <textarea
      placeholder="Enter your custom message (use {{name}} for personalization)"
      value={customMessage}
      onChange={e => setCustomMessage(e.target.value)}
      className="w-full border px-3 py-2 rounded mb-3"
    />
          <button
            onClick={handleSend}
            className="bg-green-600 text-white font-semibold py-2 px-6 rounded shadow mb-4"
          >
            Send Campaign
          </button>
          <div className="overflow-x-auto rounded border">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  {preview[0] && Object.keys(preview[0]).map((key) => (
                    <th key={key} className="px-3 py-2 border-b bg-gray-100 text-gray-700 text-left">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, idx) => (
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

      {message && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">
          {message}
        </div>
      )}
      <ToastContainer />
    </div>
  );
}