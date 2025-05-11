/* eslint-disable @typescript-eslint/no-explicit-any /
/ eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { getToken } from 'next-auth/jwt';

export async function POST(req: NextRequest) {
  await dbConnect();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const customers = await req.json();
  await Customer.insertMany(customers.map((c: any) => ({
    ...c,
    userId: token.sub ?? token.id,
  })), { ordered: false });
  return NextResponse.json({ message: 'Customers ingested' });
}