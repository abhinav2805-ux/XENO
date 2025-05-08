
import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Please login to continue</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Welcome, {session.user?.name}</h1>
      <p>Your dashboard will show recent campaigns here.</p>
    </div>
  );
}
