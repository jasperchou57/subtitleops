DROP INDEX `payment_subscription_id_idx`;--> statement-breakpoint
DROP INDEX `payment_session_id_idx`;--> statement-breakpoint
CREATE UNIQUE INDEX `payment_subscription_id_unique` ON `payment` (`subscription_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `payment_session_id_unique` ON `payment` (`session_id`);