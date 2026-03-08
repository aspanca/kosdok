import { Module } from "@nestjs/common";

import { DatabaseModule } from "../../database/database.module";

import { PROVIDER_CAPABILITY_REPO } from "./repositories/provider-capability.repo";
import { ProviderCapabilityRepository } from "./repositories/provider-capability.repository";
import { ProviderCapabilityService } from "./provider-capability.service";

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: PROVIDER_CAPABILITY_REPO,
      useExisting: ProviderCapabilityRepository,
    },
    ProviderCapabilityRepository,
    ProviderCapabilityService,
  ],
  exports: [ProviderCapabilityService],
})
export class ProviderModule {}
