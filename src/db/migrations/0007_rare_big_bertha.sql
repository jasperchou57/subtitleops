CREATE TABLE `payment_transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`payment_id` text NOT NULL,
	`user_id` text NOT NULL,
	`business_key` text NOT NULL,
	`checkout_session_id` text,
	`payment_intent_id` text,
	`invoice_id` text,
	`charge_id` text,
	`price_id` text NOT NULL,
	`amount` integer NOT NULL,
	`currency` text NOT NULL,
	`payment_status` text NOT NULL,
	`fulfillment_status` text NOT NULL,
	`failure_message` text,
	`paid_at` integer,
	`fulfilled_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`payment_id`) REFERENCES `payment`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `payment_transactions_business_key_unique` ON `payment_transactions` (`business_key`);--> statement-breakpoint
CREATE UNIQUE INDEX `payment_transactions_payment_intent_unique` ON `payment_transactions` (`payment_intent_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `payment_transactions_invoice_unique` ON `payment_transactions` (`invoice_id`);--> statement-breakpoint
CREATE INDEX `payment_transactions_payment_id_idx` ON `payment_transactions` (`payment_id`);--> statement-breakpoint
CREATE INDEX `payment_transactions_user_id_idx` ON `payment_transactions` (`user_id`);--> statement-breakpoint
CREATE INDEX `payment_transactions_checkout_session_idx` ON `payment_transactions` (`checkout_session_id`);--> statement-breakpoint
CREATE INDEX `payment_transactions_charge_id_idx` ON `payment_transactions` (`charge_id`);--> statement-breakpoint
CREATE INDEX `payment_transactions_status_idx` ON `payment_transactions` (`payment_status`,`fulfillment_status`);--> statement-breakpoint
CREATE INDEX `payment_transactions_created_at_idx` ON `payment_transactions` (`created_at`);--> statement-breakpoint
CREATE TABLE `stripe_webhook_events` (
	`id` text PRIMARY KEY NOT NULL,
	`event_type` text NOT NULL,
	`object_id` text,
	`status` text NOT NULL,
	`livemode` integer NOT NULL,
	`attempts` integer DEFAULT 1 NOT NULL,
	`last_error` text,
	`received_at` integer NOT NULL,
	`processed_at` integer,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `stripe_webhook_events_status_idx` ON `stripe_webhook_events` (`status`);--> statement-breakpoint
CREATE INDEX `stripe_webhook_events_object_idx` ON `stripe_webhook_events` (`event_type`,`object_id`);--> statement-breakpoint
CREATE INDEX `stripe_webhook_events_received_at_idx` ON `stripe_webhook_events` (`received_at`);