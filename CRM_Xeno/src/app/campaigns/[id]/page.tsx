/* eslint-disable @typescript-eslint/no-explicit-any /
/ eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { BarChart3 } from 'lucide-react'; // Ensure this is the correct library for BarChart3

export default function CampaignDetail() {
  const params = useParams();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'success' | 'failed'>('success');

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await fetch(`/api/campaigns/${params.id}`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message || 'Failed to fetch campaign');
        
        // Add debug logging
        console.log('Campaign data:', data.campaign);
        console.log('Customers:', data.campaign.customers);
        
        setCampaign(data.campaign);
      } catch (err: any) {
        console.error('Error fetching campaign:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCampaign();
    }
  }, [params.id]);

  const renderCustomerName = (customer: any) => {
    return customer.name || 
           customer.fullName || 
           (customer.firstName && customer.lastName ? `${customer.firstName} ${customer.lastName}` : '') ||
           customer.customer_name ||
           'N/A';
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!campaign) return <div className="p-6">Campaign not found</div>;

 return (
  <div className="min-h-screen bg-gradient-to-b from-slate-50 to-purple-50">
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">{campaign.name}</h1>
      {/* Success & Failed Stats */}
<div className="flex gap-6 mb-8">
  <div className="flex items-center gap-2 bg-green-50 px-6 py-3 rounded-xl shadow">
    <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
    <span className="text-green-700 font-semibold text-lg">Success:</span>
    <span className="text-green-700 font-bold text-xl">{campaign.successCount}</span>
  </div>
  <div className="flex items-center gap-2 bg-red-50 px-6 py-3 rounded-xl shadow">
    <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
    <span className="text-red-700 font-semibold text-lg">Failed:</span>
    <span className="text-red-700 font-bold text-xl">{campaign.failureCount}</span>
  </div>
</div>
  {/* Campaign Details Card */}
<div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-xl border border-blue-100 p-8 mb-10 overflow-hidden">
  {/* Decorative Icon */}
  <div className="absolute right-6 top-6 opacity-10 pointer-events-none">
    <BarChart3 className="h-20 w-20 text-blue-400" />
  </div>
  <h2 className="text-xl font-bold mb-4 text-blue-800 flex items-center gap-2">
    <BarChart3 className="h-6 w-6 text-blue-500" />
    Campaign Details
  </h2>
  <div className="grid md:grid-cols-2 gap-8">
    <div>
      <div className="mb-3">
        <span className="block text-xs uppercase text-slate-400 font-semibold mb-1">Description</span>
        <p className="text-base text-slate-700">{campaign.description}</p>
      </div>
      <div className="mb-3">
        <span className="block text-xs uppercase text-slate-400 font-semibold mb-1">Message Template</span>
        <p className="text-base text-slate-700">{campaign.message}</p>
      </div>
      <div>
        <span className="block text-xs uppercase text-slate-400 font-semibold mb-1">Total Audience</span>
        <span className="inline-block text-base font-semibold text-blue-700">{campaign.audienceSize}</span>
      </div>
    </div>
    
  </div>
</div>

      {/* Communication Logs Section */}
      <div className="bg-gradient-to-br from-blue-50 via-slate-50 to-purple-50 rounded-xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-500" />
            Communication Logs
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('success')}
              className={`px-4 py-2 rounded-md font-medium transition ${
                activeTab === 'success'
                  ? 'bg-green-100 text-green-700 shadow'
                  : 'bg-gray-100 text-gray-600 hover:bg-green-50'
              }`}
            >
              Successful ({campaign.successCount})
            </button>
            <button
              onClick={() => setActiveTab('failed')}
              className={`px-4 py-2 rounded-md font-medium transition ${
                activeTab === 'failed'
                  ? 'bg-red-100 text-red-700 shadow'
                  : 'bg-gray-100 text-gray-600 hover:bg-red-50'
              }`}
            >
              Failed ({campaign.failureCount})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-blue-100 shadow">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="px-4 py-3 bg-blue-100 text-blue-900 font-semibold text-left">Customer Name</th>
                <th className="px-4 py-3 bg-blue-100 text-blue-900 font-semibold text-left">Email</th>
                <th className="px-4 py-3 bg-blue-100 text-blue-900 font-semibold text-left">Phone</th>
                <th className="px-4 py-3 bg-blue-100 text-blue-900 font-semibold text-left">Sent At</th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === 'success' ? campaign.successLogs : campaign.failedLogs)?.map((log: any, idx: number) => (
                <tr
                  key={log._id}
                  className={`transition-colors ${
                    idx % 2 === 0 ? "bg-slate-50" : "bg-white"
                  } hover:bg-blue-50`}
                >
                  <td className="px-4 py-3 border-b border-blue-50 font-medium">{renderCustomerName(log.customerId)}</td>
                  <td className="px-4 py-3 border-b border-blue-50">{log.customerId.email || 'N/A'}</td>
                  <td className="px-4 py-3 border-b border-blue-50">{log.customerId.phone || 'N/A'}</td>
                  <td className="px-4 py-3 border-b border-blue-50">
                    <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">
                      {new Date(log.sentAt || log.createdAt).toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
              {(activeTab === 'success' ? campaign.successLogs : campaign.failedLogs)?.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500 bg-white rounded-b-lg">
                    No {activeTab === 'success' ? 'successful' : 'failed'} communications found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);}