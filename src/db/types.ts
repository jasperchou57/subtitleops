import { apikey, user } from "./auth.schema";
import {
  betaLeads,
  conversionPresets,
  conversionProjects,
  payment,
  projectVersions,
  userFiles,
  workspaceMembers,
  workspaces,
} from './app.schema';

export type User = typeof user.$inferSelect;
export type ApiKey = typeof apikey.$inferSelect;
export type UserFiles = typeof userFiles.$inferSelect;
export type Payment = typeof payment.$inferSelect;
export type Workspace = typeof workspaces.$inferSelect;
export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type ConversionPreset = typeof conversionPresets.$inferSelect;
export type ConversionProject = typeof conversionProjects.$inferSelect;
export type ProjectVersion = typeof projectVersions.$inferSelect;
export type BetaLead = typeof betaLeads.$inferSelect;
