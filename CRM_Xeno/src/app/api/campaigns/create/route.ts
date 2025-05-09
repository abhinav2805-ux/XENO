import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Campaign from '@/models/Campaign';
import { getToken } from 'next-auth/jwt';
import { Types } from 'mongoose';

export async function POST(req: NextRequest) {
  await dbConnect();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log('TOKEN:', token);
  if (!token || typeof token.sub !== 'string') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { name, description } = await req.json();
  if (!name) return NextResponse.json({ message: 'Campaign name required' }, { status: 400 });

  const campaign = await Campaign.create({
    name,
    description,
    userId: new Types.ObjectId(token.sub), // <-- Use token.sub here
  });

  return NextResponse.json({ campaign });
}