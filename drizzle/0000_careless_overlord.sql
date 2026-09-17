CREATE TYPE "public"."booking_status" AS ENUM('CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');--> statement-breakpoint
CREATE TYPE "public"."placement_status" AS ENUM('NOT_STARTED', 'PREPARATION', 'APPLIED', 'INTERVIEW', 'SHORTLISTED', 'OFFERED', 'PLACED');--> statement-breakpoint
CREATE TYPE "public"."proficiency" AS ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('SPC', 'STUDENT');--> statement-breakpoint
CREATE TYPE "public"."skill_category" AS ENUM('PROGRAMMING_LANGUAGE', 'FRAMEWORK_LIBRARY', 'DATABASE', 'CLOUD_DEVOPS', 'DATA_SCIENCE_ML', 'SOFT_SKILL', 'OTHER');--> statement-breakpoint
CREATE TABLE "mentoring_slots" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"spc_id" text NOT NULL,
	"slot_date" date NOT NULL,
	"start_time" time NOT NULL,
	"duration_minutes" smallint DEFAULT 15 NOT NULL,
	"max_capacity" smallint DEFAULT 4 NOT NULL,
	"current_bookings" smallint DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"meeting_link" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "capacity_check" CHECK ("mentoring_slots"."current_bookings" <= "mentoring_slots"."max_capacity"),
	CONSTRAINT "max_capacity_range" CHECK ("mentoring_slots"."max_capacity" >= 1 AND "mentoring_slots"."max_capacity" <= 4)
);
--> statement-breakpoint
CREATE TABLE "slot_bookings" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slot_id" text NOT NULL,
	"student_id" text NOT NULL,
	"status" "booking_status" DEFAULT 'CONFIRMED' NOT NULL,
	"student_question" text,
	"spc_feedback" text,
	"booked_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "spc_notes" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" text NOT NULL,
	"author_id" text NOT NULL,
	"content" text NOT NULL,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_skills" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" text NOT NULL,
	"name" varchar(64) NOT NULL,
	"category" "skill_category" NOT NULL,
	"proficiency" "proficiency" DEFAULT 'INTERMEDIATE' NOT NULL,
	"years_of_experience" smallint,
	"is_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"enrollment_number" varchar(32),
	"roll_number" varchar(16),
	"section" varchar(4),
	"batch" varchar(10) DEFAULT 'MCA26' NOT NULL,
	"cgpa" numeric(4, 2),
	"backlogs" smallint DEFAULT 0 NOT NULL,
	"tenth_percentage" numeric(5, 2),
	"twelfth_percentage" numeric(5, 2),
	"graduation_cgpa" numeric(4, 2),
	"graduation_degree" varchar(128),
	"graduation_year" smallint,
	"phone" varchar(16),
	"linkedin_url" text,
	"github_url" text,
	"portfolio_url" text,
	"resume_url" text,
	"placement_status" "placement_status" DEFAULT 'NOT_STARTED' NOT NULL,
	"is_actively_looking" boolean DEFAULT true NOT NULL,
	"target_role" varchar(128),
	"preferred_locations" text[],
	"expected_ctc" numeric(12, 2),
	"current_ctc" numeric(12, 2),
	"offered_company" varchar(128),
	"offered_role" varchar(128),
	"offer_date" date,
	"bio" text,
	"strengths" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "students_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "students_enrollment_number_unique" UNIQUE("enrollment_number"),
	CONSTRAINT "cgpa_range" CHECK ("students"."cgpa" IS NULL OR ("students"."cgpa" >= 0 AND "students"."cgpa" <= 10)),
	CONSTRAINT "backlogs_non_negative" CHECK ("students"."backlogs" >= 0)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"clerk_user_id" text NOT NULL,
	"role" "role" DEFAULT 'STUDENT' NOT NULL,
	"name" varchar(128) NOT NULL,
	"email" varchar(256) NOT NULL,
	"avatar_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
ALTER TABLE "mentoring_slots" ADD CONSTRAINT "mentoring_slots_spc_id_users_id_fk" FOREIGN KEY ("spc_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slot_bookings" ADD CONSTRAINT "slot_bookings_slot_id_mentoring_slots_id_fk" FOREIGN KEY ("slot_id") REFERENCES "public"."mentoring_slots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slot_bookings" ADD CONSTRAINT "slot_bookings_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spc_notes" ADD CONSTRAINT "spc_notes_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spc_notes" ADD CONSTRAINT "spc_notes_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_skills" ADD CONSTRAINT "student_skills_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "mentoring_slots_spc_idx" ON "mentoring_slots" USING btree ("spc_id");--> statement-breakpoint
CREATE INDEX "mentoring_slots_date_idx" ON "mentoring_slots" USING btree ("slot_date");--> statement-breakpoint
CREATE UNIQUE INDEX "slot_bookings_unique" ON "slot_bookings" USING btree ("slot_id","student_id");--> statement-breakpoint
CREATE INDEX "slot_bookings_slot_idx" ON "slot_bookings" USING btree ("slot_id");--> statement-breakpoint
CREATE INDEX "slot_bookings_student_idx" ON "slot_bookings" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "spc_notes_student_idx" ON "spc_notes" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "student_skills_student_idx" ON "student_skills" USING btree ("student_id");--> statement-breakpoint
CREATE UNIQUE INDEX "student_skills_unique_skill" ON "student_skills" USING btree ("student_id","name");--> statement-breakpoint
CREATE INDEX "students_placement_status_idx" ON "students" USING btree ("placement_status");--> statement-breakpoint
CREATE INDEX "students_batch_idx" ON "students" USING btree ("batch");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");