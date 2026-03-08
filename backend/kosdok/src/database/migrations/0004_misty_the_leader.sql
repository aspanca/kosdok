CREATE TABLE `capabilities` (
	`key` varchar(120) NOT NULL,
	`category` varchar(64) NOT NULL,
	`description` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `capabilities_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `cities` (
	`code` varchar(64) NOT NULL,
	`country_code` varchar(2) NOT NULL,
	`name` varchar(120) NOT NULL,
	`normalized_name` varchar(120) NOT NULL,
	`postal_code` varchar(20),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cities_code` PRIMARY KEY(`code`),
	CONSTRAINT `cities_country_normalized_name_unique` UNIQUE(`country_code`,`normalized_name`)
);
--> statement-breakpoint
CREATE TABLE `organization_capabilities` (
	`organization_id` varchar(36) NOT NULL,
	`capability_key` varchar(120) NOT NULL,
	`enabled` boolean NOT NULL,
	`config_json` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `organization_capabilities_organization_id_capability_key_pk` PRIMARY KEY(`organization_id`,`capability_key`)
);
--> statement-breakpoint
CREATE TABLE `organization_service_areas` (
	`organization_id` varchar(36) NOT NULL,
	`city_code` varchar(64) NOT NULL,
	`coverage_type` varchar(64) NOT NULL DEFAULT 'city',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `organization_service_areas_organization_id_city_code_pk` PRIMARY KEY(`organization_id`,`city_code`)
);
--> statement-breakpoint
CREATE TABLE `organization_services` (
	`organization_id` varchar(36) NOT NULL,
	`service_id` varchar(36) NOT NULL,
	`enabled` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `organization_services_organization_id_service_id_pk` PRIMARY KEY(`organization_id`,`service_id`)
);
--> statement-breakpoint
CREATE TABLE `organization_sites` (
	`id` varchar(36) NOT NULL,
	`organization_id` varchar(36) NOT NULL,
	`city_code` varchar(64) NOT NULL,
	`label` varchar(160) NOT NULL,
	`address_line1` varchar(255),
	`postal_code` varchar(20),
	`latitude` decimal(10,7),
	`longitude` decimal(10,7),
	`timezone` varchar(64) NOT NULL DEFAULT 'UTC',
	`status` varchar(32) NOT NULL DEFAULT 'active',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `organization_sites_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `organization_staff` (
	`id` varchar(36) NOT NULL,
	`organization_id` varchar(36) NOT NULL,
	`site_id` varchar(36),
	`user_id` varchar(36) NOT NULL,
	`role` varchar(64) NOT NULL,
	`status` varchar(32) NOT NULL DEFAULT 'active',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `organization_staff_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `organization_type_capability_defaults` (
	`type_code` varchar(64) NOT NULL,
	`capability_key` varchar(120) NOT NULL,
	`enabled_default` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `organization_type_capability_defaults_type_code_capability_key_pk` PRIMARY KEY(`type_code`,`capability_key`)
);
--> statement-breakpoint
CREATE TABLE `organization_type_links` (
	`organization_id` varchar(36) NOT NULL,
	`type_code` varchar(64) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `organization_type_links_organization_id_type_code_pk` PRIMARY KEY(`organization_id`,`type_code`)
);
--> statement-breakpoint
CREATE TABLE `organization_types` (
	`code` varchar(64) NOT NULL,
	`label` varchar(120) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `organization_types_code` PRIMARY KEY(`code`)
);
--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` varchar(36) NOT NULL,
	`name` varchar(160) NOT NULL,
	`slug` varchar(160) NOT NULL,
	`legal_name` varchar(255),
	`status` varchar(32) NOT NULL DEFAULT 'active',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `organizations_id` PRIMARY KEY(`id`),
	CONSTRAINT `organizations_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `service_capability_requirements` (
	`service_id` varchar(36) NOT NULL,
	`capability_key` varchar(120) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `service_capability_requirements_service_id_capability_key_pk` PRIMARY KEY(`service_id`,`capability_key`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` varchar(36) NOT NULL,
	`code` varchar(120) NOT NULL,
	`name` varchar(160) NOT NULL,
	`specialty_id` varchar(36),
	`category` varchar(100),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `services_id` PRIMARY KEY(`id`),
	CONSTRAINT `services_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `specialties` (
	`id` varchar(36) NOT NULL,
	`code` varchar(100) NOT NULL,
	`name` varchar(160) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `specialties_id` PRIMARY KEY(`id`),
	CONSTRAINT `specialties_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
ALTER TABLE `organization_capabilities` ADD CONSTRAINT `organization_capabilities_organization_id_organizations_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organization_capabilities` ADD CONSTRAINT `organization_capabilities_capability_key_capabilities_key_fk` FOREIGN KEY (`capability_key`) REFERENCES `capabilities`(`key`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organization_service_areas` ADD CONSTRAINT `organization_service_areas_organization_id_organizations_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organization_service_areas` ADD CONSTRAINT `organization_service_areas_city_code_cities_code_fk` FOREIGN KEY (`city_code`) REFERENCES `cities`(`code`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organization_services` ADD CONSTRAINT `organization_services_organization_id_organizations_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organization_services` ADD CONSTRAINT `organization_services_service_id_services_id_fk` FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organization_sites` ADD CONSTRAINT `organization_sites_organization_id_organizations_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organization_sites` ADD CONSTRAINT `organization_sites_city_code_cities_code_fk` FOREIGN KEY (`city_code`) REFERENCES `cities`(`code`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organization_staff` ADD CONSTRAINT `organization_staff_organization_id_organizations_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organization_staff` ADD CONSTRAINT `organization_staff_site_id_organization_sites_id_fk` FOREIGN KEY (`site_id`) REFERENCES `organization_sites`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organization_staff` ADD CONSTRAINT `organization_staff_user_id_auth_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `auth_users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organization_type_capability_defaults` ADD CONSTRAINT `organization_type_capability_defaults_type_code_organization_types_code_fk` FOREIGN KEY (`type_code`) REFERENCES `organization_types`(`code`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organization_type_capability_defaults` ADD CONSTRAINT `organization_type_capability_defaults_capability_key_capabilities_key_fk` FOREIGN KEY (`capability_key`) REFERENCES `capabilities`(`key`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organization_type_links` ADD CONSTRAINT `organization_type_links_organization_id_organizations_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organization_type_links` ADD CONSTRAINT `organization_type_links_type_code_organization_types_code_fk` FOREIGN KEY (`type_code`) REFERENCES `organization_types`(`code`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `service_capability_requirements` ADD CONSTRAINT `service_capability_requirements_service_id_services_id_fk` FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `service_capability_requirements` ADD CONSTRAINT `service_capability_requirements_capability_key_capabilities_key_fk` FOREIGN KEY (`capability_key`) REFERENCES `capabilities`(`key`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `services` ADD CONSTRAINT `services_specialty_id_specialties_id_fk` FOREIGN KEY (`specialty_id`) REFERENCES `specialties`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `organization_services_service_org_enabled_idx` ON `organization_services` (`service_id`,`organization_id`,`enabled`);--> statement-breakpoint
CREATE INDEX `organization_sites_city_status_org_idx` ON `organization_sites` (`city_code`,`status`,`organization_id`);--> statement-breakpoint
CREATE INDEX `organization_sites_coordinates_idx` ON `organization_sites` (`latitude`,`longitude`);--> statement-breakpoint
CREATE INDEX `organization_staff_org_user_idx` ON `organization_staff` (`organization_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `organization_staff_org_site_user_idx` ON `organization_staff` (`organization_id`,`site_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `organization_type_capability_defaults_cap_type_idx` ON `organization_type_capability_defaults` (`capability_key`,`type_code`);--> statement-breakpoint
CREATE INDEX `organization_type_links_type_org_idx` ON `organization_type_links` (`type_code`,`organization_id`);--> statement-breakpoint
CREATE INDEX `services_specialty_id_idx` ON `services` (`specialty_id`);