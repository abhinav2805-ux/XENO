import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import CommunicationLog from '@/models/CommunicationLog';

export async function POST(req: NextRequest) {
  await dbConnect();
  const { messageId, status } = await req.json();

  if (!messageId || !status) {
    return NextResponse.json({ message: 'Missing messageId or status' }, { status: 400 });
  }

  // Update the delivery status in the communication log
  await CommunicationLog.updateOne(
    { messageId },
    { $set: { status, deliveredAt: new Date() } }
  );

  return NextResponse.json({ message: 'Delivery status updated' });
}