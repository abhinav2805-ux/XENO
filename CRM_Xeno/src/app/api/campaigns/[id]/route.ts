import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Campaign from '@/models/Campaign';
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
    })
    .populate({
      path: 'customers',
      model: 'Customer',
      select: 'name email phone firstName lastName fullName customer_name', // Specify fields
      options: { 
        virtuals: true,
        lean: true 
      }
    })
    .lean({ virtuals: true });

    if (!campaign) {
      return NextResponse.json({ message: 'Campaign not found' }, { status: 404 });
    }

    // Transform customer data to include displayName
    if (campaign.customers) {
      campaign.customers = campaign.customers.map((customer: any) => ({
        ...customer,
        displayName: customer.name || 
                    customer.fullName || 
                    (customer.firstName && customer.lastName ? `${customer.firstName} ${customer.lastName}` : null) ||
                    customer.customer_name ||
                    'N/A'
      }));
    }

    campaign.audienceSize = campaign.customers?.length || 0;

    return NextResponse.json({ campaign });
  } catch (error: any) {
    console.error('Campaign detail error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}