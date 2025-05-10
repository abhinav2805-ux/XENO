'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function CampaignDetail() {
  const params = useParams();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!campaign) return <div className="p-6">Campaign not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{campaign.name}</h1>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Campaign Details</h2>
        <p className="text-gray-600 mb-2">Description: {campaign.description}</p>
        <p className="text-gray-600 mb-2">Message: {campaign.message}</p>
        <p className="text-gray-600 mb-2">Audience Size: {campaign.customers?.length || 0}</p>
        <p className="text-gray-600">Created: {new Date(campaign.createdAt).toLocaleString()}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Audience Preview</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b">Email</th>
                <th className="px-4 py-2 border-b">Phone</th>
              </tr>
            </thead>
            <tbody>
              {campaign.customers?.map((customer: any) => {
                // Try to get the best name possible
                const displayName = 
                  customer.name ||
                  customer.fullName ||
                  customer.full_name ||
                  (customer.firstName && customer.lastName 
                    ? `${customer.firstName} ${customer.lastName}`
                    : '') ||
                  (customer.first_name && customer.last_name 
                    ? `${customer.first_name} ${customer.last_name}`
                    : '') ||
                  customer.customer_name ||
                  'N/A';

                return (
                  <tr key={customer._id}>
                    <td className="px-4 py-2 border-b">{displayName}</td>
                    <td className="px-4 py-2 border-b">{customer.email || 'N/A'}</td>
                    <td className="px-4 py-2 border-b">{customer.phone || 'N/A'}</td>
                  </tr>
                );
              })}
              {(!campaign.customers || campaign.customers.length === 0) && (
                <tr>
                  <td colSpan={3} className="px-4 py-2 text-center text-gray-500">
                    No customers found
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