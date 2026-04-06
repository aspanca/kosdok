CREATE TABLE `user_profiles` (
	`user_id` varchar(36) NOT NULL,
	`full_name` varchar(120) NOT NULL,
	`phone` varchar(30),
	`city` varchar(100),
	`locale` varchar(10) NOT NULL DEFAULT 'sq',
	`avatar_url` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_profiles_user_id` PRIMARY KEY(`user_id`)
);
--> statement-breakpoint
ALTER TABLE `user_profiles` ADD CONSTRAINT `user_profiles_user_id_auth_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `auth_users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `auth_users` DROP COLUMN `full_name`;