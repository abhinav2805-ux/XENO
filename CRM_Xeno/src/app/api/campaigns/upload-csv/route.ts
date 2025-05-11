/* eslint-disable @typescript-eslint/no-explicit-any /
/ eslint-disable @typescript-eslint/no-unused-vars */
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
      transformHeader: header => header.trim().toLowerCase(), // Convert headers to lowercase
    });

    const csvImportId = new Types.ObjectId();

    // Map CSV fields to customer fields
    const results = parsed.data.map((row: any) => {
      // Try to find the name from various possible CSV column names
      const name = row.name || 
                  row.full_name || 
                  row.fullname || 
                  row.customer_name || 
                  (row.first_name && row.last_name ? `${row.first_name} ${row.last_name}` : '') ||
                  (row.firstname && row.lastname ? `${row.firstname} ${row.lastname}` : '');

      return {
        userId: new Types.ObjectId(token.sub ?? token.id),
        csvImportId,
        name: name || undefined,
        firstName: row.first_name || row.firstname || undefined,
        lastName: row.last_name || row.lastname || undefined,
        email: row.email || undefined,
        phone: row.phone || row.phone_number || row.contact || undefined,
        // Keep original data as well
        ...row
      };
    });

    try {
      await Customer.insertMany(results);
      
      const inserted = await Customer.find({ 
        userId: new Types.ObjectId(token.sub ?? token.id),
        csvImportId 
      })
      .limit(100)
      .lean();

      console.log('Sample customer data:', inserted[0]); // Debug log

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