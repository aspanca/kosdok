import { Test, TestingModule } from "@nestjs/testing";

import { AppController } from "./app.controller";

describe("AppController", () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("health", () => {
    it("should return healthy status", () => {
      const response = appController.getHealth();
      expect(response.data.service).toBe("kosdok-backend");
      expect(response.data.status).toBe("ok");
      expect(typeof response.data.timestamp).toBe("string");
    });
  });
});
