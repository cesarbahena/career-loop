import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { jobApplications } from '@/lib/schema';

export async function GET() {
  const allApplications = await db.select().from(jobApplications);
  return NextResponse.json(allApplications);
}
