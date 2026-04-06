ALTER TABLE `cities` ADD `status` varchar(32) DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE `cities` ADD `source` varchar(32) DEFAULT 'seed' NOT NULL;--> statement-breakpoint
ALTER TABLE `cities` ADD `requested_by_organization_id` varchar(36);--> statement-breakpoint
ALTER TABLE `cities` ADD `requested_by_user_id` varchar(36);--> statement-breakpoint
ALTER TABLE `cities` ADD `review_note` varchar(500);--> statement-breakpoint
ALTER TABLE `cities` ADD `reviewed_by_user_id` varchar(36);--> statement-breakpoint
ALTER TABLE `cities` ADD `reviewed_at` timestamp;--> statement-breakpoint
ALTER TABLE `services` ADD `service_type` varchar(32) DEFAULT 'consultation' NOT NULL;--> statement-breakpoint
ALTER TABLE `services` ADD `status` varchar(32) DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE `services` ADD `source` varchar(32) DEFAULT 'seed' NOT NULL;--> statement-breakpoint
ALTER TABLE `services` ADD `requested_by_organization_id` varchar(36);--> statement-breakpoint
ALTER TABLE `services` ADD `requested_by_user_id` varchar(36);--> statement-breakpoint
ALTER TABLE `services` ADD `review_note` varchar(500);--> statement-breakpoint
ALTER TABLE `services` ADD `reviewed_by_user_id` varchar(36);--> statement-breakpoint
ALTER TABLE `services` ADD `reviewed_at` timestamp;--> statement-breakpoint
ALTER TABLE `specialties` ADD `status` varchar(32) DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE `specialties` ADD `source` varchar(32) DEFAULT 'seed' NOT NULL;--> statement-breakpoint
ALTER TABLE `cities` ADD CONSTRAINT `cities_requested_by_user_id_auth_users_id_fk` FOREIGN KEY (`requested_by_user_id`) REFERENCES `auth_users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cities` ADD CONSTRAINT `cities_reviewed_by_user_id_auth_users_id_fk` FOREIGN KEY (`reviewed_by_user_id`) REFERENCES `auth_users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `services` ADD CONSTRAINT `services_requested_by_user_id_auth_users_id_fk` FOREIGN KEY (`requested_by_user_id`) REFERENCES `auth_users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `services` ADD CONSTRAINT `services_reviewed_by_user_id_auth_users_id_fk` FOREIGN KEY (`reviewed_by_user_id`) REFERENCES `auth_users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `cities_status_country_code_idx` ON `cities` (`status`,`country_code`);--> statement-breakpoint
CREATE INDEX `cities_status_requested_org_idx` ON `cities` (`status`,`requested_by_organization_id`);--> statement-breakpoint
CREATE INDEX `services_status_service_type_idx` ON `services` (`status`,`service_type`);--> statement-breakpoint
CREATE INDEX `services_status_specialty_id_idx` ON `services` (`status`,`specialty_id`);--> statement-breakpoint
CREATE INDEX `services_status_requested_org_idx` ON `services` (`status`,`requested_by_organization_id`);--> statement-breakpoint
CREATE INDEX `specialties_status_code_idx` ON `specialties` (`status`,`code`);