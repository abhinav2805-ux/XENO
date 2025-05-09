import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { getToken } from 'next-auth/jwt';
import Papa from 'papaparse';
import { Types } from 'mongoose';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  await dbConnect();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  // Parse multipart form
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const campaignId = formData.get('campaignId') as string;

  if (!file) return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
  if (!campaignId || !Types.ObjectId.isValid(campaignId)) {
    return NextResponse.json({ message: 'Invalid or missing campaignId' }, { status: 400 });
  }

  // Read file as text
  const text = await file.text();

  // Parse CSV
  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
  if (parsed.errors.length > 0) {
    return NextResponse.json({ message: 'CSV parse error', errors: parsed.errors }, { status: 400 });
  }

  // Attach userId and campaignId as ObjectId
  const results = parsed.data.map((row: any) => ({
    ...row,
    userId: new Types.ObjectId(token.sub ?? token.id),
    campaignId: new Types.ObjectId(campaignId),
  }));

  try {
    await Customer.insertMany(results, { ordered: false });
    return NextResponse.json({ message: 'CSV uploaded and data saved', count: results.length });
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json({
        message: 'Some customers were not added because their email already exists.',
        error: err.message,
      }, { status: 409 });
    }
    return NextResponse.json({ message: 'Error uploading CSV', error: err.message }, { status: 500 });
  }
}