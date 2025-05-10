'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{campaign.name}</h1>
      
      {/* Campaign Details Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Campaign Details</h2>
        <p className="text-gray-600 mb-2">Description: {campaign.description}</p>
        <p className="text-gray-600 mb-2">Message Template: {campaign.message}</p>
        <p className="text-gray-600 mb-2">Total Audience: {campaign.audienceSize}</p>
        <div className="flex gap-4 mt-4">
          <div className="bg-green-50 px-4 py-2 rounded-md">
            <span className="text-green-600 font-medium">Success: {campaign.successCount}</span>
          </div>
          <div className="bg-red-50 px-4 py-2 rounded-md">
            <span className="text-red-600 font-medium">Failed: {campaign.failureCount}</span>
          </div>
        </div>
      </div>

      {/* Communication Logs Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Communication Logs</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('success')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'success'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Successful ({campaign.successCount})
            </button>
            <button
              onClick={() => setActiveTab('failed')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'failed'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Failed ({campaign.failureCount})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Customer Name</th>
                <th className="px-4 py-2 border-b">Email</th>
                <th className="px-4 py-2 border-b">Phone</th>
                <th className="px-4 py-2 border-b">Sent At</th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === 'success' ? campaign.successLogs : campaign.failedLogs)
                ?.map((log: any) => (
                  <tr key={log._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">
                      {renderCustomerName(log.customerId)}
                    </td>
                    <td className="px-4 py-2 border-b">{log.customerId.email || 'N/A'}</td>
                    <td className="px-4 py-2 border-b">{log.customerId.phone || 'N/A'}</td>
                    <td className="px-4 py-2 border-b">
                      {new Date(log.sentAt || log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              {(activeTab === 'success' ? campaign.successLogs : campaign.failedLogs)?.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No {activeTab === 'success' ? 'successful' : 'failed'} communications found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}