import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Campaign from '@/models/Campaign';
import CommunicationLog from '@/models/CommunicationLog';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  await dbConnect();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ campaigns: [] });

  // Get campaigns for this user, latest first
  const campaigns = await Campaign.find({ userId: token.id }).sort({ createdAt: -1 }).lean();

  // For each campaign, get delivery stats
  const campaignIds = campaigns.map(c => c._id);
  const logs = await CommunicationLog.aggregate([
    { $match: { campaignId: { $in: campaignIds } } },
    { $group: {
      _id: "$campaignId",
      sent: { $sum: { $cond: [{ $eq: ["$status", "SENT"] }, 1, 0] } },
      failed: { $sum: { $cond: [{ $eq: ["$status", "FAILED"] }, 1, 0] } },
      audienceSize: { $sum: 1 }
    }}
  ]);
  const statsMap = Object.fromEntries(logs.map(l => [l._id.toString(), l]));

  const result = campaigns.map(c => ({
    ...c,
    sent: statsMap[c._id.toString()]?.sent || 0,
    failed: statsMap[c._id.toString()]?.failed || 0,
    audienceSize: statsMap[c._id.toString()]?.audienceSize || 0,
  }));

  return NextResponse.json({ campaigns: result });
}