import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Order from '@/models/Order';
import { getToken } from 'next-auth/jwt';

export async function POST(req: NextRequest) {
  await dbConnect();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const orders = await req.json();
  await Order.insertMany(orders.map((o: any) => ({
    ...o,
    userId: token.sub ?? token.id,
  })), { ordered: false });
  return NextResponse.json({ message: 'Orders ingested' });
}