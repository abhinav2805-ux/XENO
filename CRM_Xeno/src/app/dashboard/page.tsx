/* eslint-disable @typescript-eslint/no-explicit-any /
/ eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, Zap, ShoppingCart, ArrowRight, Coins } from "lucide-react";

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/campaigns/history').then(res => res.json()),
      fetch('/api/stats').then(res => res.json())
    ])
      .then(([campaignData, statsData]) => {
        setCampaigns(campaignData.campaigns || []);
        setStats(statsData);
      })
      .catch(error => console.error('Dashboard loading error:', error))
      .finally(() => setIsLoading(false));
  }, []);

  const formatNumber = (num: number) => new Intl.NumberFormat().format(num);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <section className="py-12 md:py-20 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-700">Dashboard</h1>
            <p className="text-lg text-slate-600 mb-6">
              Welcome back! Here’s a snapshot of your CRM performance and recent campaigns.
            </p>
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/createCampaign">
                + Create New Campaign
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="shadow hover:shadow-md transition-all duration-300">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div>
                <CardDescription>Total Campaigns</CardDescription>
                <CardTitle className="text-2xl">
                  {isLoading ? '...' : formatNumber(stats?.totalCampaigns ?? 0)}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-emerald-500">↑ {stats?.campaignsGrowth ?? 0}% from last month</div>
            </CardContent>
          </Card>
          <Card className="shadow hover:shadow-md transition-all duration-300">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Users className="h-8 w-8 text-emerald-600" />
              <div>
                <CardDescription>Total Customers</CardDescription>
                <CardTitle className="text-2xl">
                  {isLoading ? '...' : formatNumber(stats?.totalCustomers ?? 0)}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-emerald-500">↑ {stats?.customersGrowth ?? 0}% from last month</div>
            </CardContent>
          </Card>
          <Card className="shadow hover:shadow-md transition-all duration-300">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Zap className="h-8 w-8 text-yellow-500" />
              <div>
                <CardDescription>Last Campaign Delivery Rate</CardDescription>
                <CardTitle className="text-2xl">
                  {isLoading ? '...' : stats?.lastDeliveryRate ?? '0%'}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-emerald-500">↑ {stats?.deliveryGrowth ?? 0}% from last campaign</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
     
       {/* Past Campaigns Table */}
<div className="bg-gradient-to-br from-blue-50 via-slate-50 to-purple-50 rounded-xl shadow-xl p-8 mt-8">
  <h2 className="text-2xl font-bold mb-6 text-blue-800 flex items-center gap-2">
    <BarChart3 className="h-6 w-6 text-blue-500" />
    Past Campaigns
  </h2>
  <div className="overflow-x-auto rounded-lg border border-blue-100 shadow">
    <table className="min-w-full bg-white rounded-lg overflow-hidden">
      <thead>
        <tr>
          <th className="px-4 py-3 bg-blue-100 text-blue-900 font-semibold text-left">Name</th>
          <th className="px-4 py-3 bg-blue-100 text-blue-900 font-semibold text-left">Created</th>
          <th className="px-4 py-3 bg-blue-100 text-blue-900 font-semibold text-left">Audience</th>
          <th className="px-4 py-3 bg-blue-100 text-blue-900 font-semibold text-left">Sent</th>
          <th className="px-4 py-3 bg-blue-100 text-blue-900 font-semibold text-left">Failed</th>
          <th className="px-4 py-3 bg-blue-100 text-blue-900 font-semibold text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {campaigns.map((c, idx) => (
          <tr
            key={c._id}
            className={`transition-colors ${
              idx % 2 === 0 ? "bg-slate-50" : "bg-white"
            } hover:bg-blue-50`}
          >
            <td className="px-4 py-3 border-b border-blue-50 font-medium">{c.name}</td>
            <td className="px-4 py-3 border-b border-blue-50">{new Date(c.createdAt).toLocaleString()}</td>
            <td className="px-4 py-3 border-b border-blue-50">{c.audienceSize}</td>
            <td className="px-4 py-3 border-b border-blue-50">
              <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">
                {c.sent}
              </span>
            </td>
            <td className="px-4 py-3 border-b border-blue-50">
              <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                c.failed > 0
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-500"
              }`}>
                {c.failed}
              </span>
            </td>
            <td className="px-4 py-3 border-b border-blue-50">
              <Link href={`/campaigns/${c._id}`}>
                <span className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium underline cursor-pointer transition">
                  View
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </td>
          </tr>
        ))}
        {campaigns.length === 0 && (
          <tr>
            <td colSpan={6} className="text-center py-6 text-gray-400 bg-white rounded-b-lg">
              No campaigns yet.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>
      </section>
    </div>
  );
}