/* eslint-disable @typescript-eslint/no-explicit-any /
/ eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "@/models/User";
import { dbConnect } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  await mongoose.connect(process.env.MONGODB_URI!);
  const { email, password, name } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ message: "User already exists" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed, name });

  return NextResponse.json({ message: "User created", user: { email: user.email, name: user.name } });
}