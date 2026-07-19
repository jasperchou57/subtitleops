CREATE TABLE `beta_leads` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`plan_id` text NOT NULL,
	`use_case` text,
	`source` text DEFAULT 'pricing' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `beta_leads_email_plan_unique` ON `beta_leads` (`email`,`plan_id`);--> statement-breakpoint
CREATE INDEX `beta_leads_created_at_idx` ON `beta_leads` (`created_at`);--> statement-breakpoint
CREATE TABLE `conversion_presets` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`created_by` text NOT NULL,
	`name` text NOT NULL,
	`output_format` text NOT NULL,
	`file_name_pattern` text NOT NULL,
	`settings` text NOT NULL,
	`shared` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `conversion_presets_workspace_id_idx` ON `conversion_presets` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `conversion_presets_created_by_idx` ON `conversion_presets` (`created_by`);--> statement-breakpoint
CREATE TABLE `conversion_projects` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`created_by` text NOT NULL,
	`name` text NOT NULL,
	`status` text NOT NULL,
	`output_format` text NOT NULL,
	`file_count` integer DEFAULT 0 NOT NULL,
	`success_count` integer DEFAULT 0 NOT NULL,
	`failed_count` integer DEFAULT 0 NOT NULL,
	`issue_count` integer DEFAULT 0 NOT NULL,
	`manifest` text NOT NULL,
	`archive_file_id` text,
	`retention_until` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`archive_file_id`) REFERENCES `user_files`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `conversion_projects_workspace_id_idx` ON `conversion_projects` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `conversion_projects_created_by_idx` ON `conversion_projects` (`created_by`);--> statement-breakpoint
CREATE INDEX `conversion_projects_created_at_idx` ON `conversion_projects` (`created_at`);--> statement-breakpoint
CREATE INDEX `conversion_projects_retention_until_idx` ON `conversion_projects` (`retention_until`);--> statement-breakpoint
CREATE TABLE `project_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`created_by` text NOT NULL,
	`version` integer NOT NULL,
	`status` text NOT NULL,
	`note` text,
	`manifest` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `conversion_projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `project_versions_project_version_unique` ON `project_versions` (`project_id`,`version`);--> statement-breakpoint
CREATE INDEX `project_versions_project_id_idx` ON `project_versions` (`project_id`);--> statement-breakpoint
CREATE TABLE `workspace_members` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`user_id` text,
	`email` text NOT NULL,
	`role` text NOT NULL,
	`status` text NOT NULL,
	`invite_token` text,
	`invited_by` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`invited_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `workspace_members_workspace_email_unique` ON `workspace_members` (`workspace_id`,`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `workspace_members_invite_token_unique` ON `workspace_members` (`invite_token`);--> statement-breakpoint
CREATE INDEX `workspace_members_workspace_id_idx` ON `workspace_members` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `workspace_members_user_id_idx` ON `workspace_members` (`user_id`);--> statement-breakpoint
CREATE TABLE `workspaces` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`owner_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `workspaces_slug_unique` ON `workspaces` (`slug`);--> statement-breakpoint
CREATE INDEX `workspaces_owner_id_idx` ON `workspaces` (`owner_id`);--> statement-breakpoint
ALTER TABLE `payment` ADD `plan_id` text;