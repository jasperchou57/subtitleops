/**
 * Application database schema (non-auth tables).
 * Add your app tables here; keep Better Auth tables in auth.schema.ts.
 */

import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';
import { user } from './auth.schema';
import type { PaymentScene, PaymentStatus, PaymentType, PlanInterval } from '@/payment/types';

/**
 * Payment: subscription and one-time
 */
export const payment = sqliteTable(
  'payment',
  {
    id: text('id').primaryKey(),
    planId: text('plan_id'),
    priceId: text('price_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    customerId: text('customer_id').notNull(),
    subscriptionId: text('subscription_id'),
    sessionId: text('session_id'),
    invoiceId: text('invoice_id').unique(),
    type: text('type').notNull().$type<PaymentType>(), // 'subscription' | 'one_time'
    scene: text('scene').$type<PaymentScene>(), // 'subscription' | 'lifetime'
    interval: text('interval').$type<PlanInterval>(), // 'month' | 'year'
    status: text('status').notNull().$type<PaymentStatus>(),
    paid: integer('paid', { mode: 'boolean' }).notNull().default(false),
    periodStart: integer('period_start', { mode: 'timestamp_ms' }),
    periodEnd: integer('period_end', { mode: 'timestamp_ms' }),
    cancelAtPeriodEnd: integer('cancel_at_period_end', { mode: 'boolean' }),
    trialStart: integer('trial_start', { mode: 'timestamp_ms' }),
    trialEnd: integer('trial_end', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    index('payment_user_id_idx').on(table.userId),
    index('payment_customer_id_idx').on(table.customerId),
    uniqueIndex('payment_subscription_id_unique').on(table.subscriptionId),
    uniqueIndex('payment_session_id_unique').on(table.sessionId),
    index('payment_invoice_id_idx').on(table.invoiceId),
    index('payment_paid_idx').on(table.paid),
    index('payment_user_paid_idx').on(table.userId, table.paid),
  ]
);

export const paymentRelations = relations(payment, ({ one }) => ({
  user: one(user, { fields: [payment.userId], references: [user.id] }),
}));

/**
 * User files
 * metadata for files uploaded to R2 (path userfiles/{userId}/xxx);
 * filename = stored name on R2 (e.g. uuid.ext);
 * originalName = user's file name.
 */
export const userFiles = sqliteTable(
  'user_files',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    filename: text('filename').notNull(),
    originalName: text('original_name').notNull(),
    contentType: text('content_type').notNull(),
    size: integer('size').notNull(),
    r2Key: text('r2_key').notNull(),
    isPublic: integer('is_public', { mode: 'boolean' }),
    description: text('description'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    index('user_files_user_id_idx').on(table.userId),
    index('user_files_r2_key_idx').on(table.r2Key),
  ]
);

export const userFilesRelations = relations(userFiles, ({ one }) => ({
  user: one(user, {
    fields: [userFiles.userId],
    references: [user.id],
  }),
}));

/**
 * Daily production API usage shared by every API key owned by a user.
 */
export const productionApiUsage = sqliteTable(
  'production_api_usage',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    usageDate: text('usage_date').notNull(),
    requestCount: integer('request_count').notNull().default(0),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.usageDate] }),
    index('production_api_usage_date_idx').on(table.usageDate),
  ]
);

export type WorkspaceRole = 'owner' | 'editor' | 'reviewer';
export type WorkspaceMemberStatus = 'invited' | 'active';
export type ProjectStatus =
  | 'draft'
  | 'processing'
  | 'ready'
  | 'needs_review'
  | 'approved'
  | 'failed';

export const workspaces = sqliteTable(
  'workspaces',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    ownerId: text('owner_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    uniqueIndex('workspaces_slug_unique').on(table.slug),
    index('workspaces_owner_id_idx').on(table.ownerId),
  ]
);

export const workspaceMembers = sqliteTable(
  'workspace_members',
  {
    id: text('id').primaryKey(),
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    userId: text('user_id').references(() => user.id, {
      onDelete: 'cascade',
    }),
    email: text('email').notNull(),
    role: text('role').notNull().$type<WorkspaceRole>(),
    status: text('status').notNull().$type<WorkspaceMemberStatus>(),
    inviteToken: text('invite_token'),
    invitedBy: text('invited_by').references(() => user.id, {
      onDelete: 'set null',
    }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    uniqueIndex('workspace_members_workspace_email_unique').on(
      table.workspaceId,
      table.email
    ),
    uniqueIndex('workspace_members_invite_token_unique').on(table.inviteToken),
    index('workspace_members_workspace_id_idx').on(table.workspaceId),
    index('workspace_members_user_id_idx').on(table.userId),
  ]
);

export const conversionPresets = sqliteTable(
  'conversion_presets',
  {
    id: text('id').primaryKey(),
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    createdBy: text('created_by')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    outputFormat: text('output_format').notNull(),
    fileNamePattern: text('file_name_pattern').notNull(),
    settings: text('settings').notNull(),
    shared: integer('shared', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    index('conversion_presets_workspace_id_idx').on(table.workspaceId),
    index('conversion_presets_created_by_idx').on(table.createdBy),
  ]
);

export const conversionProjects = sqliteTable(
  'conversion_projects',
  {
    id: text('id').primaryKey(),
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    createdBy: text('created_by')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    status: text('status').notNull().$type<ProjectStatus>(),
    outputFormat: text('output_format').notNull(),
    fileCount: integer('file_count').notNull().default(0),
    successCount: integer('success_count').notNull().default(0),
    failedCount: integer('failed_count').notNull().default(0),
    issueCount: integer('issue_count').notNull().default(0),
    manifest: text('manifest').notNull(),
    archiveFileId: text('archive_file_id').references(() => userFiles.id, {
      onDelete: 'set null',
    }),
    retentionUntil: integer('retention_until', {
      mode: 'timestamp_ms',
    }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    index('conversion_projects_workspace_id_idx').on(table.workspaceId),
    index('conversion_projects_created_by_idx').on(table.createdBy),
    index('conversion_projects_created_at_idx').on(table.createdAt),
    index('conversion_projects_retention_until_idx').on(table.retentionUntil),
  ]
);

export const projectVersions = sqliteTable(
  'project_versions',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id')
      .notNull()
      .references(() => conversionProjects.id, { onDelete: 'cascade' }),
    createdBy: text('created_by')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    version: integer('version').notNull(),
    status: text('status').notNull().$type<ProjectStatus>(),
    note: text('note'),
    manifest: text('manifest').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    uniqueIndex('project_versions_project_version_unique').on(
      table.projectId,
      table.version
    ),
    index('project_versions_project_id_idx').on(table.projectId),
  ]
);

export const betaLeads = sqliteTable(
  'beta_leads',
  {
    id: text('id').primaryKey(),
    email: text('email').notNull(),
    planId: text('plan_id').notNull(),
    useCase: text('use_case'),
    source: text('source').notNull().default('pricing'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    uniqueIndex('beta_leads_email_plan_unique').on(table.email, table.planId),
    index('beta_leads_created_at_idx').on(table.createdAt),
  ]
);
