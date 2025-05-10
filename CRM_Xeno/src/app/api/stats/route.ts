import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Campaign from '@/models/Campaign';
import Customer from '@/models/Customer';
import CommunicationLog from '@/models/CommunicationLog';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({}, { status: 401 });

    const userId = token.sub ?? token.id;

    // Get total campaigns
    const totalCampaigns = await Campaign.countDocuments({ userId });

    // Get total unique customers
    const totalCustomers = await Customer.countDocuments({ userId });

    // Get delivery rate from the most recent campaign
    const lastCampaign = await Campaign.findOne({ userId }).sort({ createdAt: -1 });
    let lastDeliveryRate = '0%';

    if (lastCampaign) {
      const logs = await CommunicationLog.aggregate([
        { $match: { campaignId: lastCampaign._id } },
        { $group: {
          _id: null,
          total: { $sum: 1 },
          sent: { $sum: { $cond: [{ $eq: ['$status', 'SENT'] }, 1, 0] } }
        }}
      ]);

      if (logs.length > 0) {
        const rate = (logs[0].sent / logs[0].total) * 100;
        lastDeliveryRate = `${rate.toFixed(1)}%`;
      }
    }

    return NextResponse.json({
      totalCampaigns,
      totalCustomers,
      lastDeliveryRate
    });

  } catch (error: any) {
    console.error('Stats Error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}