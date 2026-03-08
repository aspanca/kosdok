import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { App } from "supertest/types";

import { AppModule } from "./../src/app.module";

describe("AppController (e2e)", () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix("v1");
    await app.init();
  });

  it("/v1/health (GET)", () => {
    return request(app.getHttpServer())
      .get("/v1/health")
      .expect(200)
      .expect((response) => {
        const body = response.body as {
          data?: {
            service?: string;
            status?: string;
          };
        };

        expect(body.data?.service).toBe("kosdok-backend");
        expect(body.data?.status).toBe("ok");
      });
  });
});
