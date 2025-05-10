import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Campaign from '@/models/Campaign';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    await dbConnect();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({}, { status: 401 });

    // Await context.params as required by Next.js 13+
    const params = await context.params;
    const { id } = params;

    const campaign = await Campaign.findOne({ 
      _id: id,
      userId: token.sub ?? token.id 
    })
    .populate({
      path: 'customers',
      select: '-__v' // Exclude version field
    })
    .lean();

    if (!campaign) {
      return NextResponse.json({ message: 'Campaign not found' }, { status: 404 });
    }

    // Add audience size to the response
    campaign.audienceSize = campaign.customers?.length || 0;

    return NextResponse.json({ campaign });
  } catch (error: any) {
    console.error('Campaign detail error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}