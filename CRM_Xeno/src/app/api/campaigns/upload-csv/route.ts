import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { getToken } from 'next-auth/jwt';
import Papa from 'papaparse';
import { Types } from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });

    const text = await file.text();
    const parsed = Papa.parse(text, { 
      header: true, 
      skipEmptyLines: true,
      dynamicTyping: true,
      transformHeader: header => header.trim(),
    });

    if (parsed.errors.length > 0) {
      return NextResponse.json({ message: 'CSV parse error', errors: parsed.errors }, { status: 400 });
    }

    const csvImportId = new Types.ObjectId();

    try {
      // Prepare the data
      const results = parsed.data.map((row: any) => ({
        ...row,
        userId: new Types.ObjectId(token.sub ?? token.id),
        csvImportId
      }));

      // Insert new data without ordered option
      await Customer.insertMany(results);

      // Fetch preview
      const inserted = await Customer.find({ 
        userId: new Types.ObjectId(token.sub ?? token.id),
        csvImportId 
      })
      .limit(100)
      .lean();

      return NextResponse.json({ 
        message: 'CSV uploaded and data saved', 
        count: results.length,
        fields: parsed.meta.fields,
        csvImportId: csvImportId.toString(),
        preview: inserted,
      });

    } catch (error: any) {
      console.error('MongoDB Error:', error);
      return NextResponse.json({ 
        message: 'Error saving customer data', 
        error: error.message 
      }, { status: 500 });
    }
  } catch (err: any) {
    console.error('Error in CSV upload:', err);
    return NextResponse.json({ 
      message: 'Error processing CSV', 
      error: err.message 
    }, { status: 500 });
  }
}