// app/dashboard/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  // This check is now redundant with the middleware, but keeping it as a fallback
  if (!session) {
    redirect('/signin?callbackUrl=/dashboard');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {session.user?.name || 'User'}</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Dashboard Overview</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="font-medium">Active Campaigns</h3>
            <p className="text-2xl font-bold">5</p>
          </div>
          <div className="bg-green-50 p-4 rounded-md">
            <h3 className="font-medium">Total Customers</h3>
            <p className="text-2xl font-bold">247</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-md">
            <h3 className="font-medium">Open Opportunities</h3>
            <p className="text-2xl font-bold">12</p>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-3">
            <li className="border-b pb-2">Campaign "Summer Sale" launched yesterday</li>
            <li className="border-b pb-2">3 new leads added to the system</li>
            <li className="border-b pb-2">Meeting scheduled with Client XYZ</li>
            <li className="border-b pb-2">New email template created</li>
            <li>Follow-up task due tomorrow</li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
              New Campaign
            </button>
            <button className="bg-green-600 text-white p-3 rounded hover:bg-green-700">
              Add Customer
            </button>
            <button className="bg-purple-600 text-white p-3 rounded hover:bg-purple-700">
              Create Task
            </button>
            <button className="bg-yellow-600 text-white p-3 rounded hover:bg-yellow-700">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}