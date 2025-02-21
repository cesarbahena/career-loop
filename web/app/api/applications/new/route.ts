import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { jobApplications } from '@/lib/schema';
import { InferInsertModel } from 'drizzle-orm';

type NewJobApplication = InferInsertModel<typeof jobApplications>;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.title || !body.company || !body.url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newApplication: NewJobApplication = {
      title: body.title,
      company: body.company,
      url: body.url,
      status: body.status || 'applied', // Default status
    };

    const result = await db.insert(jobApplications).values(newApplication).returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating job application:', error);
    return NextResponse.json({ error: 'Failed to create job application' }, { status: 500 });
  }
}
