import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Campaign from '@/models/Campaign';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  await dbConnect();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({}, { status: 401 });

  // Await params in case it's a Promise (Next.js App Router requirement)
  const { id } = await context.params;
  const campaign = await Campaign.findOne({ _id: id, userId: token.sub ?? token.id }).lean();
  if (!campaign) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json({ campaign });
}