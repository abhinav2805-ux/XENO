'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function CampaignDetails() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/campaigns/${id}`)
      .then(res => res.json())
      .then(data => setCampaign(data.campaign));
  }, [id]);

  if (!campaign) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{campaign.name}</h1>
      <div className="mb-2"><b>Description:</b> {campaign.description}</div>
      <div className="mb-2"><b>Sent At:</b> {campaign.sentAt ? new Date(campaign.sentAt).toLocaleString() : '-'}</div>
      <div className="mb-2"><b>Message Sent:</b> {campaign.message}</div>
      <div className="mb-2"><b>Filters Applied:</b>
        <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(campaign.filters, null, 2)}</pre>
      </div>
      <div className="mb-2"><b>Audience Preview:</b></div>
      <div className="overflow-x-auto rounded border mb-4">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              {campaign.preview && campaign.preview[0] && Object.keys(campaign.preview[0]).map((key) => (
                <th key={key} className="px-3 py-2 border-b bg-gray-100 text-gray-700 text-left">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {campaign.preview && campaign.preview.map((row: any, idx: number) => (
              <tr key={idx} className="hover:bg-blue-50">
                {Object.values(row).map((val: any, i: number) => (
                  <td key={i} className="px-3 py-2 border-b">{val as string}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}