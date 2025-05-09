import { NextRequest, NextResponse } from 'next/server';
import {dbConnect} from '@/lib/mongodb'
import Campaign from '@/models/Campaign';
import Customer from '@/models/Customer';
import CommunicationLog from '@/models/CommunicationLog';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  await dbConnect();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({});

  const totalCampaigns = await Campaign.countDocuments({ userId: token.id });
  const totalCustomers = await Customer.countDocuments({ userId: token.id });

  // Last campaign delivery rate
  const lastCampaign = await Campaign.findOne({ userId: token.id }).sort({ createdAt: -1 });
  let lastDeliveryRate = "-";
  if (lastCampaign) {
    const logs = await CommunicationLog.find({ campaignId: lastCampaign._id });
    const sent = logs.filter(l => l.status === "SENT").length;
    const total = logs.length;
    lastDeliveryRate = total > 0 ? `${Math.round((sent / total) * 100)}%` : "-";
  }

  return NextResponse.json({ totalCampaigns, totalCustomers, lastDeliveryRate });
}