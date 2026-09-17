import {
  pgTable,
  pgEnum,
  text,
  varchar,
  smallint,
  numeric,
  boolean,
  timestamp,
  date,
  time,
  uniqueIndex,
  index,
  check,
} from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

// ─────────────────────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────────────────────

/** Role gate — mirrors Clerk's publicMetadata.role */
export const roleEnum = pgEnum('role', ['SPC', 'STUDENT'])

/** Placement status enum */
export const placementStatusEnum = pgEnum('placement_status', [
  'NOT_STARTED',
  'PREPARATION',
  'APPLIED',
  'INTERVIEW',
  'SHORTLISTED',
  'OFFERED',
  'PLACED',
])

/** Skill category enum */
export const skillCategoryEnum = pgEnum('skill_category', [
  'PROGRAMMING_LANGUAGE',
  'FRAMEWORK_LIBRARY',
  'DATABASE',
  'CLOUD_DEVOPS',
  'DATA_SCIENCE_ML',
  'SOFT_SKILL',
  'OTHER',
])

/**
 * Proficiency enum — BEGINNER / INTERMEDIATE / ADVANCED
 * (EXPERT removed — SPC UI only exposes three levels)
 */
export const proficiencyEnum = pgEnum('proficiency', [
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED',
])

/** Booking status enum */
export const bookingStatusEnum = pgEnum('booking_status', [
  'CONFIRMED',
  'CANCELLED',
  'COMPLETED',
  'NO_SHOW',
])

// ─────────────────────────────────────────────────────────────
// Table: users
// Synced from Clerk via Webhook (user.created / user.updated)
// id === Clerk's user_id (e.g., "user_2abc...")
// ─────────────────────────────────────────────────────────────
export const users = pgTable(
  'users',
  {
    id: text('id').primaryKey(), // matches Clerk user_id
    clerkUserId: text('clerk_user_id').notNull().unique(),
    role: roleEnum('role').notNull().default('STUDENT'),
    name: varchar('name', { length: 128 }).notNull(),
    email: varchar('email', { length: 256 }).notNull(),
    avatarUrl: text('avatar_url'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [uniqueIndex('users_email_idx').on(t.email)]
)

// ─────────────────────────────────────────────────────────────
// Table: students
// One-to-one with users (STUDENT role only)
// ─────────────────────────────────────────────────────────────
export const students = pgTable(
  'students',
  {
    id: text('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: text('user_id')
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: 'cascade' }),

    // Enrollment & Academic Identity
    enrollmentNumber: varchar('enrollment_number', { length: 32 }).unique(),
    rollNumber: varchar('roll_number', { length: 16 }),
    section: varchar('section', { length: 4 }), // 'A', 'B'
    batch: varchar('batch', { length: 10 }).notNull().default('MCA26'),

    // Academic Performance
    cgpa: numeric('cgpa', { precision: 4, scale: 2 }),
    backlogs: smallint('backlogs').notNull().default(0),
    tenthPercentage: numeric('tenth_percentage', { precision: 5, scale: 2 }),
    twelfthPercentage: numeric('twelfth_percentage', { precision: 5, scale: 2 }),
    graduationCgpa: numeric('graduation_cgpa', { precision: 4, scale: 2 }),
    graduationDegree: varchar('graduation_degree', { length: 128 }),
    graduationYear: smallint('graduation_year'),

    // Contact & Profiles
    phone: varchar('phone', { length: 16 }),
    linkedinUrl: text('linkedin_url'),
    githubUrl: text('github_url'),
    portfolioUrl: text('portfolio_url'),
    resumeUrl: text('resume_url'),

    // Placement Details
    placementStatus: placementStatusEnum('placement_status')
      .notNull()
      .default('NOT_STARTED'),
    isActivelyLooking: boolean('is_actively_looking').notNull().default(true),
    targetRole: varchar('target_role', { length: 128 }),
    preferredLocations: text('preferred_locations').array(),
    expectedCtc: numeric('expected_ctc', { precision: 12, scale: 2 }),
    currentCtc: numeric('current_ctc', { precision: 12, scale: 2 }),
    offeredCompany: varchar('offered_company', { length: 128 }),
    offeredRole: varchar('offered_role', { length: 128 }),
    offerDate: date('offer_date'),

    // Bio & Strengths
    bio: text('bio'),
    strengths: text('strengths'),

    // Timestamps
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index('students_placement_status_idx').on(t.placementStatus),
    index('students_batch_idx').on(t.batch),
    check(
      'cgpa_range',
      sql`${t.cgpa} IS NULL OR (${t.cgpa} >= 0 AND ${t.cgpa} <= 10)`
    ),
    check('backlogs_non_negative', sql`${t.backlogs} >= 0`),
  ]
)

// ─────────────────────────────────────────────────────────────
// Table: student_skills
// ─────────────────────────────────────────────────────────────
export const studentSkills = pgTable(
  'student_skills',
  {
    id: text('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    studentId: text('student_id')
      .notNull()
      .references(() => students.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 64 }).notNull(),
    category: skillCategoryEnum('category').notNull(),
    proficiency: proficiencyEnum('proficiency').notNull().default('INTERMEDIATE'),
    yearsOfExperience: smallint('years_of_experience'),
    isVerified: boolean('is_verified').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('student_skills_student_idx').on(t.studentId),
    uniqueIndex('student_skills_unique_skill').on(t.studentId, t.name),
  ]
)

// ─────────────────────────────────────────────────────────────
// Table: spc_notes (Internal to SPCs — per student)
// ─────────────────────────────────────────────────────────────
export const spcNotes = pgTable(
  'spc_notes',
  {
    id: text('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    studentId: text('student_id')
      .notNull()
      .references(() => students.id, { onDelete: 'cascade' }),
    authorId: text('author_id')
      .notNull()
      .references(() => users.id, { onDelete: 'set null' })
      .$type<string>(),
    content: text('content').notNull(),
    isPinned: boolean('is_pinned').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index('spc_notes_student_idx').on(t.studentId)]
)

// ─────────────────────────────────────────────────────────────
// Table: mentoring_slots
// 15-min offline windows, 1 student per slot
// meetingLink removed — replaced with location (offline venue)
// ─────────────────────────────────────────────────────────────
export const mentoringSlots = pgTable(
  'mentoring_slots',
  {
    id: text('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    spcId: text('spc_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    slotDate: date('slot_date').notNull(),
    startTime: time('start_time', { withTimezone: false }).notNull(),
    durationMinutes: smallint('duration_minutes').notNull().default(15),
    maxCapacity: smallint('max_capacity').notNull().default(1),
    currentBookings: smallint('current_bookings').notNull().default(0),
    isActive: boolean('is_active').notNull().default(true),
    /** Offline location — e.g., "Lab 302, Block-A" or "SPC Room, Ground Floor" */
    location: varchar('location', { length: 256 }),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index('mentoring_slots_spc_idx').on(t.spcId),
    index('mentoring_slots_date_idx').on(t.slotDate),
    check('capacity_check', sql`${t.currentBookings} <= ${t.maxCapacity}`),
    check(
      'max_capacity_range',
      sql`${t.maxCapacity} >= 1 AND ${t.maxCapacity} <= 4`
    ),
  ]
)

// ─────────────────────────────────────────────────────────────
// Table: slot_bookings
// ─────────────────────────────────────────────────────────────
export const slotBookings = pgTable(
  'slot_bookings',
  {
    id: text('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    slotId: text('slot_id')
      .notNull()
      .references(() => mentoringSlots.id, { onDelete: 'cascade' }),
    studentId: text('student_id')
      .notNull()
      .references(() => students.id, { onDelete: 'cascade' }),
    status: bookingStatusEnum('status').notNull().default('CONFIRMED'),
    studentQuestion: text('student_question'),
    spcFeedback: text('spc_feedback'),
    bookedAt: timestamp('booked_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    uniqueIndex('slot_bookings_unique').on(t.slotId, t.studentId),
    index('slot_bookings_slot_idx').on(t.slotId),
    index('slot_bookings_student_idx').on(t.studentId),
  ]
)

// ─────────────────────────────────────────────────────────────
// Table: session_questions
// Mock interview questions asked per booking session
// ─────────────────────────────────────────────────────────────
export const sessionQuestions = pgTable(
  'session_questions',
  {
    id: text('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    bookingId: text('booking_id')
      .notNull()
      .references(() => slotBookings.id, { onDelete: 'cascade' }),
    question: text('question').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index('session_questions_booking_idx').on(t.bookingId)]
)

// ─────────────────────────────────────────────────────────────
// Relations
// ─────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ one, many }) => ({
  student: one(students, {
    fields: [users.id],
    references: [students.userId],
  }),
  mentoringSlots: many(mentoringSlots),
  spcNotes: many(spcNotes),
}))

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
  skills: many(studentSkills),
  notes: many(spcNotes),
  bookings: many(slotBookings),
}))

export const studentSkillsRelations = relations(studentSkills, ({ one }) => ({
  student: one(students, {
    fields: [studentSkills.studentId],
    references: [students.id],
  }),
}))

export const spcNotesRelations = relations(spcNotes, ({ one }) => ({
  student: one(students, {
    fields: [spcNotes.studentId],
    references: [students.id],
  }),
  author: one(users, {
    fields: [spcNotes.authorId],
    references: [users.id],
  }),
}))

export const mentoringSlotsRelations = relations(
  mentoringSlots,
  ({ one, many }) => ({
    spc: one(users, {
      fields: [mentoringSlots.spcId],
      references: [users.id],
    }),
    bookings: many(slotBookings),
  })
)

export const slotBookingsRelations = relations(slotBookings, ({ one, many }) => ({
  slot: one(mentoringSlots, {
    fields: [slotBookings.slotId],
    references: [mentoringSlots.id],
  }),
  student: one(students, {
    fields: [slotBookings.studentId],
    references: [students.id],
  }),
  questions: many(sessionQuestions),
}))

export const sessionQuestionsRelations = relations(sessionQuestions, ({ one }) => ({
  booking: one(slotBookings, {
    fields: [sessionQuestions.bookingId],
    references: [slotBookings.id],
  }),
}))

// ─────────────────────────────────────────────────────────────
// Zod Schemas
// ─────────────────────────────────────────────────────────────

export const insertUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)
export type InsertUser = z.infer<typeof insertUserSchema>
export type SelectUser = z.infer<typeof selectUserSchema>

export const insertStudentSchema = createInsertSchema(students, {
  cgpa: z.coerce.number().min(0).max(10).optional(),
  backlogs: z.coerce.number().int().min(0).optional(),
  phone: z.string().regex(/^\+?[0-9\s\-()+]{7,16}$/).optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  portfolioUrl: z.string().url().optional().or(z.literal('')),
})
export const selectStudentSchema = createSelectSchema(students)
export type InsertStudent = z.infer<typeof insertStudentSchema>
export type SelectStudent = z.infer<typeof selectStudentSchema>

export const insertStudentSkillSchema = createInsertSchema(studentSkills, {
  yearsOfExperience: z.coerce.number().int().min(0).max(30).optional(),
})
export const selectStudentSkillSchema = createSelectSchema(studentSkills)
export type InsertStudentSkill = z.infer<typeof insertStudentSkillSchema>
export type SelectStudentSkill = z.infer<typeof selectStudentSkillSchema>

export const insertSpcNoteSchema = createInsertSchema(spcNotes, {
  content: z.string().min(1).max(2000),
})
export const selectSpcNoteSchema = createSelectSchema(spcNotes)
export type InsertSpcNote = z.infer<typeof insertSpcNoteSchema>
export type SelectSpcNote = z.infer<typeof selectSpcNoteSchema>

export const insertMentoringSlotSchema = createInsertSchema(mentoringSlots, {
  slotDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
  location: z.string().max(256).optional().or(z.literal('')),
})
export const selectMentoringSlotSchema = createSelectSchema(mentoringSlots)
export type InsertMentoringSlot = z.infer<typeof insertMentoringSlotSchema>
export type SelectMentoringSlot = z.infer<typeof selectMentoringSlotSchema>

export const insertSlotBookingSchema = createInsertSchema(slotBookings, {
  studentQuestion: z.string().max(500).optional().or(z.literal('')),
})
export const selectSlotBookingSchema = createSelectSchema(slotBookings)
export type InsertSlotBooking = z.infer<typeof insertSlotBookingSchema>
export type SelectSlotBooking = z.infer<typeof selectSlotBookingSchema>

export const insertSessionQuestionSchema = createInsertSchema(sessionQuestions, {
  question: z.string().min(1).max(1000),
})
export const selectSessionQuestionSchema = createSelectSchema(sessionQuestions)
export type InsertSessionQuestion = z.infer<typeof insertSessionQuestionSchema>
export type SelectSessionQuestion = z.infer<typeof selectSessionQuestionSchema>
