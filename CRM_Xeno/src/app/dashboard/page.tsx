'use client';
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/campaigns/history')
      .then(res => res.json())
      .then(data => setCampaigns(data.campaigns || []));
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Dashboard</h1>
      <div className="mb-6 flex gap-6">
        <div className="bg-white rounded shadow p-4 flex-1">
          <div className="text-gray-500">Total Campaigns</div>
          <div className="text-2xl font-bold">{stats?.totalCampaigns ?? '-'}</div>
        </div>
        <div className="bg-white rounded shadow p-4 flex-1">
          <div className="text-gray-500">Total Customers</div>
          <div className="text-2xl font-bold">{stats?.totalCustomers ?? '-'}</div>
        </div>
        <div className="bg-white rounded shadow p-4 flex-1">
          <div className="text-gray-500">Last Campaign Delivery Rate</div>
          <div className="text-2xl font-bold">{stats?.lastDeliveryRate ?? '-'}</div>
        </div>
      </div>
      <div className="flex justify-end mb-4">
       <Link
  href="/createCampaign"
  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow inline-block"
>
  + Create New Campaign
</Link>
      </div>
      <h2 className="text-xl font-semibold mb-2">Past Campaigns</h2>
      <div className="overflow-x-auto rounded border">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-3 py-2 border-b bg-gray-100 text-gray-700 text-left">Name</th>
              <th className="px-3 py-2 border-b bg-gray-100 text-gray-700 text-left">Created</th>
              <th className="px-3 py-2 border-b bg-gray-100 text-gray-700 text-left">Audience</th>
              <th className="px-3 py-2 border-b bg-gray-100 text-gray-700 text-left">Sent</th>
              <th className="px-3 py-2 border-b bg-gray-100 text-gray-700 text-left">Failed</th>
              <th className="px-3 py-2 border-b bg-gray-100 text-gray-700 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c._id} className="hover:bg-blue-50">
                <td className="px-3 py-2 border-b">{c.name}</td>
                <td className="px-3 py-2 border-b">{new Date(c.createdAt).toLocaleString()}</td>
                <td className="px-3 py-2 border-b">{c.audienceSize}</td>
                <td className="px-3 py-2 border-b">{c.sent}</td>
                <td className="px-3 py-2 border-b">{c.failed}</td>
                <td className="px-3 py-2 border-b">
                  <Link href={`/campaigns/${c._id}`}>
                    <span className="text-blue-600 underline cursor-pointer">View</span>
                  </Link>
                </td>
              </tr>
            ))}
            {campaigns.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-400">No campaigns yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}