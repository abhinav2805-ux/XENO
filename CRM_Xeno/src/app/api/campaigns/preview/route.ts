import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { getToken } from 'next-auth/jwt';

function buildMongoQueryFromRules(rules: any, userId: string, csvImportId: string) {
  let base = { userId, csvImportId };
  if (rules && rules.rules && rules.rules.length > 0) {
    base['$' + rules.combinator] = rules.rules.map((r: any) =>
      r.rules
        ? buildMongoQueryFromRules(r, userId, csvImportId)
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
  if (!isNaN(val) && typeof val !== 'boolean') return Number(val);
  return val;
}

export async function GET(req: NextRequest) {
  await dbConnect();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !(token.sub ?? token.id)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = token.sub ?? token.id;

  const { searchParams } = new URL(req.url);
  const rulesString = searchParams.get('rules');
  const csvImportId = searchParams.get('csvImportId');
  if (!csvImportId) {
    return NextResponse.json({ message: 'CSV Import ID is required' }, { status: 400 });
  }

  let mongoQuery: any = { userId, csvImportId };
  if (rulesString) {
    try {
      const parsedRules = JSON.parse(rulesString);
      const rulesQueryPart = buildMongoQueryFromRules(parsedRules, userId, csvImportId);
      for (const key in rulesQueryPart) {
        if (key !== 'userId' && key !== 'csvImportId') {
          mongoQuery[key] = rulesQueryPart[key];
        }
      }
    } catch (error) {
      console.error('Error parsing rules:', error);
      // fallback to just userId and csvImportId
    }
  }

  try {
    const data = await Customer.find(mongoQuery).limit(100).lean();
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching customer data', error: (error as Error).message }, { status: 500 });
  }
}