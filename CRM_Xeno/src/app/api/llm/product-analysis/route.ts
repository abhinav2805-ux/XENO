import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { dbConnect } from '@/lib/mongodb';
import Order from '@/models/Order';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  await dbConnect();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const userPrompt = body.prompt;
  const uploadId = body.uploadId; // <-- Get uploadId from request

  const { userId } = token.sub ? { userId: token.sub } : { userId: token.id };

  // Filter by userId and uploadId if provided
  const query: any = { userId };
  if (uploadId) query.uploadId = uploadId;

  const orders = await Order.find(query).lean();

  if (!orders.length) {
    return NextResponse.json({ error: 'No orders found' }, { status: 404 });
  }

  // Aggregate product sales
  const productSales: Record<string, number> = {};
  orders.forEach(order => {
    (order.items || []).forEach((productId: string) => {
      productSales[productId] = (productSales[productId] || 0) + 1;
    });
  });

  // Use user prompt or fallback to default
  const prompt = `
Given the following product sales data (productId: count):

${Object.entries(productSales).map(([id, count]) => `${id}: ${count}`).join('\n')}

${userPrompt || 'Give a summary of the product sales.'}
`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama3-8b-8192",
    temperature: 0.2,
  });

  // Try to extract JSON from LLM response
  const text = completion.choices[0]?.message?.content || '';
  let result;
  try {
    const match = text.match(/\{[\s\S]*\}/);
    result = match ? JSON.parse(match[0]) : JSON.parse(text);
  } catch {
    result = { summary: text };
  }

  return NextResponse.json({ ...result, productSales });
}