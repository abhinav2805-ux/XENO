import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { getToken } from 'next-auth/jwt';
import { Types } from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get('campaignId');
    const filterField = searchParams.get('filterField');
    const filterValue = searchParams.get('filterValue');

    if (!campaignId || !Types.ObjectId.isValid(campaignId)) {
      return NextResponse.json({ message: 'Invalid or missing campaignId' }, { status: 400 });
    }

    // Build the query
    const query: any = { 
      campaignId: new Types.ObjectId(campaignId),
      userId: new Types.ObjectId(token.sub ?? token.id)
    };

    // Add filter if provided
    if (filterField && filterValue) {
      // Try to determine if the value should be treated as a number
      const numericValue = Number(filterValue);
      if (!isNaN(numericValue)) {
        // Create a query that can match either string or number format
        query[filterField] = { $in: [filterValue, numericValue] };
      } else {
        // Create case-insensitive regex search for string values
        query[filterField] = { $regex: new RegExp(filterValue, 'i') };
      }
    }

    // Fetch the data
    const data = await Customer.find(query)
      .limit(100)
      .lean(); // Use lean for better performance

    // Get available fields for the UI (from the first document)
    const sample = await Customer.findOne({ campaignId: new Types.ObjectId(campaignId) }).lean();
    const availableFields = sample ? Object.keys(sample).filter(key => 
      !['_id', '__v', 'userId', 'createdAt', 'updatedAt'].includes(key)
    ) : [];

    return NextResponse.json({
      data,
      availableFields
    });
  } catch (err: any) {
    console.error('Error in preview endpoint:', err);
    return NextResponse.json({ 
      message: 'Error retrieving preview data', 
      error: err.message 
    }, { status: 500 });
  }
}