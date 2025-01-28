import { createServerFn } from '@tanstack/react-start'
import { db } from './db'
import { jobApplications, users, type JobApplication, type NewJobApplication } from './schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

// Get current user (placeholder for now)
async function getCurrentUser() {
  // TODO: Implement proper authentication
  // For now, return first user or create dummy user
  const existingUser = await db.select().from(users).limit(1)
  
  if (existingUser.length === 0) {
    const [newUser] = await db.insert(users).values({
      email: 'test@example.com',
      hashedPassword: 'dummy_hash',
      fullName: 'Test User'
    }).returning()
    return newUser
  }
  
  return existingUser[0]
}

// Job Application CRUD Server Functions

export const getJobApplications = createServerFn(
  'GET',
  async () => {
    const user = await getCurrentUser()
    const applications = await db
      .select()
      .from(jobApplications)
      .where(eq(jobApplications.userId, user.id))
      .orderBy(jobApplications.createdAt)
    
    return applications
  }
)

const createJobApplicationSchema = z.object({
  jobTitle: z.string().min(1),
  companyName: z.string().min(1),
  jobUrl: z.string().url().optional(),
  status: z.enum(['saved', 'applied', 'interviewing', 'offer_received', 'rejected', 'archived']).default('saved'),
  notes: z.string().optional(),
})

export const createJobApplication = createServerFn(
  'POST',
  createJobApplicationSchema,
  async ({ data }) => {
    const user = await getCurrentUser()
    
    const [newApplication] = await db.insert(jobApplications).values({
      ...data,
      userId: user.id,
      appliedAt: data.status === 'applied' ? new Date() : undefined,
    }).returning()
    
    return newApplication
  }
)

const updateJobApplicationSchema = z.object({
  id: z.string().uuid(),
  jobTitle: z.string().min(1).optional(),
  companyName: z.string().min(1).optional(),
  jobUrl: z.string().url().optional(),
  status: z.enum(['saved', 'applied', 'interviewing', 'offer_received', 'rejected', 'archived']).optional(),
  notes: z.string().optional(),
})

export const updateJobApplication = createServerFn({
  method: 'PUT',
}).inputValidator(updateJobApplicationSchema)
  .handler(async ({ data }) => {
    const user = await getCurrentUser()
    const { id, ...updates } = data
    
    // If status changes to 'applied' and appliedAt is not set, set it
    if (updates.status === 'applied') {
      const existing = await db.select().from(jobApplications).where(eq(jobApplications.id, id)).limit(1)
      if (existing[0] && !existing[0].appliedAt) {
        updates.appliedAt = new Date()
      }
    }
    
    const [updatedApplication] = await db
      .update(jobApplications)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(jobApplications.id, id))
      .returning()
    
    return updatedApplication
  })

export const deleteJobApplication = createServerFn({
  method: 'DELETE',
}).inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const user = await getCurrentUser()
    
    await db
      .delete(jobApplications)
      .where(eq(jobApplications.id, data.id))
    
    return { success: true }
  })