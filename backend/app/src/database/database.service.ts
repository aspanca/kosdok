import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { drizzle, MySql2Database } from "drizzle-orm/mysql2";
import { createPool, Pool } from "mysql2/promise";

import * as schema from "./schema";

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly pool: Pool;
  private readonly database: MySql2Database<typeof schema>;

  constructor(private readonly configService: ConfigService) {
    this.pool = createPool({
      host: this.configService.get<string>("DB_HOST") ?? "127.0.0.1",
      port: Number(this.configService.get<number>("DB_PORT") ?? 3306),
      user: this.configService.get<string>("DB_USER") ?? "kosdok",
      password: this.configService.get<string>("DB_PASSWORD") ?? "kosdok",
      database: this.configService.get<string>("DB_NAME") ?? "kosdok",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    this.database = drizzle(this.pool, {
      schema,
      mode: "default",
    });
  }

  get connection(): MySql2Database<typeof schema> {
    return this.database;
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}
