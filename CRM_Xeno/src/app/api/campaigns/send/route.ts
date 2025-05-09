import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import CommunicationLog from '@/models/CommunicationLog';
import { getToken } from 'next-auth/jwt';

function simulateVendorAPI(customer: any, campaign: any) {
  // Simulate 90% SENT, 10% FAILED
  return Math.random() < 0.9 ? "SENT" : "FAILED";
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { campaignId, customers, message } = await req.json();

  // For each customer, simulate sending and log result
  const logs = customers.map((customer: any) => ({
    campaignId,
    customerId: customer._id,
    userId: token.id,
    status: simulateVendorAPI(customer, campaignId),
    message,
    sentAt: new Date(),
  }));

  await CommunicationLog.insertMany(logs);

  return NextResponse.json({ message: 'Campaign sent', results: logs });
}