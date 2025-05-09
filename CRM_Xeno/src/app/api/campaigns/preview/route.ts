import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  await dbConnect();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const campaignId = searchParams.get('campaignId');
  const filterField = searchParams.get('filterField');
  const filterValue = searchParams.get('filterValue');

  // Only show customers for this campaign
  const query: any = { campaignId };
  if (filterField && filterValue) query[filterField] = filterValue;

  const data = await Customer.find(query).limit(100);
  return NextResponse.json(data);
}