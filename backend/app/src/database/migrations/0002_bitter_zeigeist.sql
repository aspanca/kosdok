CREATE TABLE `auth_email_verification_tokens` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`token_hash` varchar(128) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`used_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auth_email_verification_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `auth_email_verification_tokens_token_hash_unique` UNIQUE(`token_hash`)
);
--> statement-breakpoint
CREATE TABLE `auth_refresh_tokens` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`token_hash` varchar(128) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`revoked_at` timestamp,
	`user_agent` varchar(255),
	`ip_address` varchar(64),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auth_refresh_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `auth_refresh_tokens_token_hash_unique` UNIQUE(`token_hash`)
);
--> statement-breakpoint
ALTER TABLE `auth_users` ADD `email_verified_at` timestamp;--> statement-breakpoint
ALTER TABLE `auth_email_verification_tokens` ADD CONSTRAINT `auth_email_verification_tokens_user_id_auth_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `auth_users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `auth_refresh_tokens` ADD CONSTRAINT `auth_refresh_tokens_user_id_auth_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `auth_users`(`id`) ON DELETE cascade ON UPDATE no action;