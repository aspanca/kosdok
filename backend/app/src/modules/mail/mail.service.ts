import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createTransport, SendMailOptions, Transporter } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

type MailTransportMode = "console" | "smtp";

@Injectable()
export class MailService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MailService.name);
  private readonly transportMode: MailTransportMode;
  private readonly fromAddress: string;
  private readonly transporter: Transporter | null;
  private smtpReady = false;

  constructor(private readonly configService: ConfigService) {
    const configuredMode = this.configService.get<string>("MAIL_TRANSPORT")?.toLowerCase();
    this.transportMode = configuredMode === "smtp" ? "smtp" : "console";
    this.fromAddress = this.configService.get<string>("MAIL_FROM") ?? "no-reply@kosdok.local";

    if (this.transportMode === "smtp") {
      const host = this.configService.get<string>("MAIL_HOST") ?? "127.0.0.1";
      const port = this.configService.get<number>("MAIL_PORT") ?? 1025;
      const secure = this.configService.get<boolean>("MAIL_SECURE") ?? false;
      const user = this.configService.get<string>("MAIL_USER")?.trim();
      const password = this.configService.get<string>("MAIL_PASSWORD")?.trim();

      const options: SMTPTransport.Options = {
        host,
        port,
        secure,
      };

      if (user && password) {
        options.auth = {
          user,
          pass: password,
        };
      }

      this.transporter = createTransport(options);
      return;
    }

    this.transporter = null;
  }

  async onModuleInit(): Promise<void> {
    if (this.transporter) {
      try {
        await this.transporter.verify();
        this.smtpReady = true;
        this.logger.log("SMTP transport verified and ready");
      } catch (error) {
        this.logger.warn(
          `SMTP verification failed. Falling back to console mode: ${String(error)}`,
        );
        this.smtpReady = false;
      }
    }
  }

  async sendMail(options: SendMailOptions): Promise<void> {
    const payload: SendMailOptions = {
      from: this.fromAddress,
      ...options,
    };

    if (!this.transporter || !this.smtpReady) {
      const recipient = this.stringifyRecipient(payload.to);
      const subject = payload.subject ?? "";

      this.logger.log(`[MAIL:console] to=${recipient} subject=${subject}`);
      return;
    }

    await this.transporter.sendMail(payload);
  }

  async sendTemplate(parameters: {
    to: string;
    subject: string;
    template: string;
    variables: Record<string, string | number>;
  }): Promise<void> {
    const html = this.renderTemplate(parameters.template, parameters.variables);

    await this.sendMail({
      to: parameters.to,
      subject: parameters.subject,
      html,
    });
  }

  private renderTemplate(template: string, variables: Record<string, string | number>): string {
    return Object.entries(variables).reduce((content, [key, value]) => {
      const matcher = new RegExp(`{{\\s*${key}\\s*}}`, "g");
      return content.replace(matcher, String(value));
    }, template);
  }

  private stringifyRecipient(value: SendMailOptions["to"]): string {
    if (!value) {
      return "unknown";
    }

    if (typeof value === "string") {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((entry) => this.stringifyRecipient(entry)).join(", ");
    }

    if (typeof value === "object" && "address" in value) {
      const name = value.name?.trim();
      return name ? `${name} <${value.address}>` : value.address;
    }

    return "unsupported-recipient";
  }

  onModuleDestroy(): void {
    this.transporter?.close();
  }
}
