import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const jobApplications = pgTable('job_applications', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  company: text('company').notNull(),
  url: text('url').notNull(),
  status: text('status').notNull().default('applied'),
  appliedAt: timestamp('applied_at').defaultNow().notNull(),
});
