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
  try {
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

    // Parse CSV with dynamic typing to handle numbers and dates properly
    const parsed = Papa.parse(text, { 
      header: true, 
      skipEmptyLines: true,
      dynamicTyping: true,  // Convert strings to numbers/booleans when possible
      transformHeader: (header) => header.trim() // Trim whitespace from headers
    });
    
    if (parsed.errors.length > 0) {
      return NextResponse.json({ 
        message: 'CSV parse error', 
        errors: parsed.errors 
      }, { status: 400 });
    }

    // Store the header fields in case we need them later
    const headers = parsed.meta.fields || [];

    // Attach userId and campaignId as ObjectId to each row
    const results = parsed.data.map((row: any) => ({
      ...row,
      userId: new Types.ObjectId(token.sub ?? token.id),
      campaignId: new Types.ObjectId(campaignId),
    }));
    console.log('Parsed CSV data:', results);
    try {
      // Insert the documents
      await Customer.insertMany(results, { ordered: false });
      return NextResponse.json({ 
        message: 'CSV uploaded and data saved', 
        count: results.length,
        fields: headers
      });
    } catch (err: any) {
      if (err.code === 11000) {
        // Handle duplicate key errors
        return NextResponse.json({
          message: 'Some customers were not added because their email already exists.',
          error: err.message,
        }, { status: 409 });
      }
      throw err; // Re-throw for general error handling
    }
  } catch (err: any) {
    console.error('Error in CSV upload:', err);
    return NextResponse.json({ 
      message: 'Error uploading CSV', 
      error: err.message 
    }, { status: 500 });
  }
}