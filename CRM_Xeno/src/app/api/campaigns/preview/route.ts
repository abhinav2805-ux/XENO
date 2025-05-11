/* eslint-disable @typescript-eslint/no-explicit-any /
/ eslint-disable @typescript-eslint/no-unused-vars */
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

    const url = new URL(req.url);
    const rulesParam = url.searchParams.get('rules');
    const csvImportId = url.searchParams.get('csvImportId');

    if (!csvImportId) {
      return NextResponse.json({ message: 'CSV Import ID is required' }, { status: 400 });
    }

    const query = rulesParam ? JSON.parse(rulesParam) : { rules: [] };
    
    // Build MongoDB query from rules
    let mongoQuery: any = {
      userId: new Types.ObjectId(token.sub ?? token.id),
      csvImportId: new Types.ObjectId(csvImportId)
    };

    if (query.rules && query.rules.length > 0) {
      const conditions = query.rules.map((rule: any) => {
        const { field, operator, value } = rule;
        
        switch (operator) {
          case 'equal':
            return { [field]: value };
          case 'notEqual':
            return { [field]: { $ne: value } };
          case 'greaterThan':
            return { [field]: { $gt: Number(value) } };
          case 'lessThan':
            return { [field]: { $lt: Number(value) } };
          case 'greaterThanOrEqual':
            return { [field]: { $gte: Number(value) } };
          case 'lessThanOrEqual':
            return { [field]: { $lte: Number(value) } };
          case 'contains':
            return { [field]: { $regex: value, $options: 'i' } };
          case 'notContains':
            return { [field]: { $not: { $regex: value, $options: 'i' } } };
          case 'beginsWith':
            return { [field]: { $regex: `^${value}`, $options: 'i' } };
          case 'endsWith':
            return { [field]: { $regex: `${value}$`, $options: 'i' } };
          default:
            return null;
        }
      }).filter(Boolean);

      if (conditions.length > 0) {
        mongoQuery = {
          ...mongoQuery,
          [query.combinator === 'or' ? '$or' : '$and']: conditions
        };
      }
    }

    console.log('MongoDB Query:', JSON.stringify(mongoQuery, null, 2));

    const customers = await Customer.find(mongoQuery)
      .lean()
      .limit(100);

    return NextResponse.json({ 
      message: 'Preview generated',
      data: customers,
      count: customers.length
    });

  } catch (error: any) {
    console.error('Preview error:', error);
    return NextResponse.json({ 
      message: error.message || 'Error generating preview'
    }, { 
      status: 500 
    });
  }
}