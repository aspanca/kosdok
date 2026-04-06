import { Module } from "@nestjs/common";

import { DatabaseModule } from "../../database/database.module";

import { PROVIDER_CAPABILITY_REPO } from "./repositories/provider-capability.repo";
import { ProviderCapabilityRepository } from "./repositories/provider-capability.repository";
import { PROVIDER_STAFF_SCOPE_REPO } from "./repositories/provider-staff-scope.repo";
import { ProviderStaffScopeRepository } from "./repositories/provider-staff-scope.repository";
import { ProviderCapabilityService } from "./provider-capability.service";
import { ProviderScopeAuthorizationService } from "./provider-scope-authorization.service";
import { ProviderCapabilityCatalogSeeder } from "./seeders/provider-capability-catalog.seeder";
import { ProviderServiceCapabilityRequirementsSeeder } from "./seeders/provider-service-capability-requirements.seeder";

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: PROVIDER_CAPABILITY_REPO,
      useExisting: ProviderCapabilityRepository,
    },
    {
      provide: PROVIDER_STAFF_SCOPE_REPO,
      useExisting: ProviderStaffScopeRepository,
    },
    ProviderCapabilityRepository,
    ProviderStaffScopeRepository,
    ProviderCapabilityService,
    ProviderScopeAuthorizationService,
    ProviderCapabilityCatalogSeeder,
    ProviderServiceCapabilityRequirementsSeeder,
  ],
  exports: [
    ProviderCapabilityService,
    ProviderScopeAuthorizationService,
    ProviderCapabilityCatalogSeeder,
    ProviderServiceCapabilityRequirementsSeeder,
  ],
})
export class ProviderModule {}
