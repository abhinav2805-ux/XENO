import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { getToken } from 'next-auth/jwt';
import { Types } from 'mongoose';

function buildMongoQueryFromRules(rules: any, campaignId: string, userId: string) {
  // Recursively convert rules to MongoDB query
  if (!rules) return { campaignId: new Types.ObjectId(campaignId), userId: new Types.ObjectId(userId) };
  let base = { campaignId: new Types.ObjectId(campaignId), userId: new Types.ObjectId(userId) };
  if (rules.rules && rules.rules.length > 0) {
    base['$' + rules.combinator] = rules.rules.map((r: any) =>
      r.rules
        ? buildMongoQueryFromRules(r, campaignId, userId)
        : { [r.field]: { [mongoOp(r.operator)]: parseValue(r.value) } }
    );
  }
  return base;
}
function mongoOp(op: string) {
  switch (op) {
    case '=': return '$eq';
    case '!=': return '$ne';
    case '<': return '$lt';
    case '<=': return '$lte';
    case '>': return '$gt';
    case '>=': return '$gte';
    case 'contains': return '$regex';
    default: return '$eq';
  }
}
function parseValue(val: any) {
  if (!isNaN(val)) return Number(val);
  return val;
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get('campaignId');
    const rules = searchParams.get('rules');
    if (!campaignId || !Types.ObjectId.isValid(campaignId)) {
      return NextResponse.json({ message: 'Invalid or missing campaignId' }, { status: 400 });
    }
    let query = { campaignId: new Types.ObjectId(campaignId), userId: new Types.ObjectId(token.sub ?? token.id) };
    if (rules) {
      try {
        const parsedRules = JSON.parse(rules);
        query = buildMongoQueryFromRules(parsedRules, campaignId, token.sub ?? token.id);
      } catch {}
    }
    const data = await Customer.find(query).limit(100).lean();
    return NextResponse.json({ data });
  } catch (err: any) {
    console.error('Error in preview endpoint:', err);
    return NextResponse.json({ 
      message: 'Error retrieving preview data', 
      error: err.message 
    }, { status: 500 });
  }
}