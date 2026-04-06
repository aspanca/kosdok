import { Controller, Get } from "@nestjs/common";

import { Public } from "./modules/identity/decorators/public.decorator";

@Controller()
export class AppController {
  @Public()
  @Get("health")
  getHealth() {
    return {
      data: {
        service: "kosdok-backend",
        status: "ok",
        timestamp: new Date().toISOString(),
      },
    };
  }
}
