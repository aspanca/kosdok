CREATE TABLE `auth_users` (
	`id` varchar(36) NOT NULL,
	`email` varchar(255) NOT NULL,
	`full_name` varchar(120) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`roles` json NOT NULL,
	`permissions` json NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auth_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `auth_users_email_unique` UNIQUE(`email`)
);
