import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Campaign from '@/models/Campaign';
import CommunicationLog from '@/models/CommunicationLog';
import { getToken } from 'next-auth/jwt';
import { v4 as uuidv4 } from 'uuid';

function simulateVendorAPI() {
  return Math.random() < 0.8 ? "SENT" : "FAILED";
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { name, description, message, filters, preview ,csvImportId} = body;

  const campaign = await Campaign.create({
    name,
    description,
    userId: token.sub ?? token.id,
    sentAt: new Date(),
    message,
    filters,
    customers: preview.map((cust: any) => cust._id),
    csvImportId,
  });

  const logs = preview.map((customer: any) => ({
    campaignId: campaign._id,
    customerId: customer._id,
    userId: token.sub ?? token.id,
    status: simulateVendorAPI(),
    message: message.replace('{{name}}', customer.name || 'Customer'),
    sentAt: new Date(),
    messageId: uuidv4(),
  }));

  await CommunicationLog.insertMany(logs);

  return NextResponse.json({ message: 'Campaign sent', campaign, results: logs });
}
