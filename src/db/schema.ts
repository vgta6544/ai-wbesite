import { pgTable, serial, text, boolean, integer, timestamp } from 'drizzle-orm/pg-core';

// Users table (Firebase Auth linked)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  role: text('role').default('admin'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Projects table (Dynamic portfolio items)
export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  coverImage: text('cover_image').notNull(),
  images: text('images').notNull(), // JSON stringified array of URLs
  videoUrl: text('video_url'),
  tools: text('tools').notNull(), // JSON stringified array of tool names
  projectDate: text('project_date').notNull(),
  client: text('client'),
  featured: boolean('featured').default(false).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Services table (Design and development offerings)
export const services = pgTable('services', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  icon: text('icon').notNull(),
  enabled: boolean('enabled').default(true).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Inquiries and Live Chat Messages table
export const messages = pgTable('messages', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  product: text('product'),
  isChat: boolean('is_chat').default(false).notNull(),
  status: text('status').default('New').notNull(),
  createdAt: text('created_at').notNull(),
});

// Site Settings table (Single record configuration)
export const siteSettings = pgTable('site_settings', {
  id: text('id').primaryKey().default('default'),
  siteTitle: text('site_title').notNull(),
  professionalTitle: text('professional_title').notNull(),
  heroTitle: text('hero_title').notNull(),
  heroSubtitle: text('hero_subtitle').notNull(),
  heroDescription: text('hero_description').notNull(),
  primaryCta: text('primary_cta').notNull(),
  secondaryCta: text('secondary_cta').notNull(),
  bio: text('bio').notNull(),
  email: text('email').notNull(),
  whatsapp: text('whatsapp').notNull(),
  location: text('location').notNull(),
  availabilityStatus: text('availability_status').notNull(),
  isOnline: boolean('is_online').default(true).notNull(),
  socialLinks: text('social_links').notNull(), // JSON stringified
  footerText: text('footer_text').notNull(),
  updatedAt: text('updated_at').notNull(),
});
