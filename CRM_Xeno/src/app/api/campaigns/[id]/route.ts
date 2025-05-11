/* eslint-disable @typescript-eslint/no-explicit-any /
/ eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Campaign from '@/models/Campaign';
import CommunicationLog from '@/models/CommunicationLog';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    await dbConnect();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({}, { status: 401 });

    const params = await context.params;
    const { id } = params;

    const campaign = await Campaign.findOne({ 
      _id: id,
      userId: token.sub ?? token.id 
    }).lean();

    if (!campaign) {
      return NextResponse.json({ message: 'Campaign not found' }, { status: 404 });
    }

    // Get communication logs stats
    const logs = await CommunicationLog.find({ campaignId: id })
      .populate('customerId', 'name email phone firstName lastName fullName customer_name')
      .lean();

    const successLogs = logs.filter(log => log.status === 'SENT');
    const failedLogs = logs.filter(log => log.status === 'FAILED');

    return NextResponse.json({ 
      campaign: {
        ...campaign,
        audienceSize: campaign.customers?.length || 0,
        successCount: successLogs.length,
        failureCount: failedLogs.length,
        successLogs,
        failedLogs
      }
    });
  } catch (error: any) {
    console.error('Campaign detail error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}