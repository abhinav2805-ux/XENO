import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import CommunicationLog from '@/models/CommunicationLog';
import { getToken } from 'next-auth/jwt';
import { v4 as uuidv4 } from 'uuid';
import Campaign from '@/models/Campaign';
function simulateVendorAPI() {
  return Math.random() < 0.9 ? "SENT" : "FAILED";
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { campaignId, customers, message } = await req.json();

  const logs = customers.map((customer: any) => ({
    campaignId,
    customerId: customer._id,
    userId: token.sub ?? token.id,
    status: simulateVendorAPI(),
    message: message.replace('{{name}}', customer.name || 'Customer'),
    sentAt: new Date(),
    messageId: uuidv4(),
  }));

  await CommunicationLog.insertMany(logs);

// Save filters, preview, and message to the campaign
await Campaign.findByIdAndUpdate(
  campaignId,
  {
    $set: {
      filters, // Pass filters from frontend
      preview: customers,        // Save previewed audience
      message,                   // Save the message sent
      sentAt: new Date()
    }
  }
);

  return NextResponse.json({ message: 'Campaign sent', results: logs });
}