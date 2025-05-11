/* eslint-disable @typescript-eslint/no-explicit-any /
/ eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { dbConnect } from '@/lib/mongodb';
import Order from '@/models/Order';
import Papa from 'papaparse';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  await dbConnect();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  // Read the file from the request
  const formData = await req.formData();
  const file = formData.get('file');
  if (!file || typeof file === 'string') {
    return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
  }

  // Read file as text
  const buffer = Buffer.from(await file.arrayBuffer());
  const csvText = buffer.toString('utf-8');

  // Parse CSV
  const { data, errors } = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  if (errors.length > 0) {
    return NextResponse.json({ message: 'CSV parse error', errors }, { status: 400 });
  }

  // Generate a unique uploadId for this batch
  const uploadId = randomUUID();

  // Add userId and uploadId to each order
  const userId = token.sub ?? token.id;
  const orders = data.map((order: any) => ({
    ...order,
    userId,
    uploadId, // <-- Add uploadId here
    orderDate: order.orderDate ? new Date(order.orderDate) : new Date(),
    amount: Number(order.amount),
    items: Array.isArray(order.items)
      ? order.items
      : typeof order.items === 'string'
        ? order.items.split(',').map((i: string) => i.trim())
        : [],
  }));

  // Insert into DB
  await Order.insertMany(orders, { ordered: false });

  return NextResponse.json({ message: 'Orders ingested', count: orders.length, uploadId }); // <-- Return uploadId
}