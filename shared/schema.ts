import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

// === AUTH MODELS (Replit Auth) ===
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  username: text("username"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: text("role", { enum: ["donor", "ngo"] }),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// === APP MODELS ===
export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  foodType: text("food_type").notNull(),
  quantity: text("quantity").notNull(),
  location: text("location").notNull(),
  expiryTime: timestamp("expiry_time").notNull(),
  notes: text("notes"),
  status: text("status", { enum: ["available", "requested", "collected"] }).default("available").notNull(),
  donorId: varchar("donor_id").notNull(), 
  ngoId: varchar("ngo_id"), 
  createdAt: timestamp("created_at").defaultNow(),
});

// === BASE SCHEMAS ===
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDonationSchema = createInsertSchema(donations).omit({ id: true, createdAt: true, status: true, ngoId: true, donorId: true });

// === EXPLICIT API CONTRACT TYPES ===
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Donation = typeof donations.$inferSelect;
export type InsertDonation = z.infer<typeof insertDonationSchema>;

// Request types
export type CreateDonationRequest = InsertDonation & { donorId: string };
export type UpdateDonationStatusRequest = { status: "available" | "requested" | "collected"; ngoId?: string };

// Response types
export type DonationResponse = Donation & { donorName?: string; ngoName?: string };
export type UpsertUser = typeof users.$inferInsert;
