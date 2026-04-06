import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

type RuleKey = "sign_in" | "refresh" | "forgot_password" | "reset_password" | "resend_verification";

type Rule = {
  maxAttempts: number;
  windowMs: number;
  blockMs: number;
};

type Bucket = {
  count: number;
  resetAt: number;
  blockedUntil: number;
};

@Injectable()
export class AuthRateLimitService {
  private readonly rules: Record<RuleKey, Rule> = {
    sign_in: {
      maxAttempts: 5,
      windowMs: 10 * 60 * 1000,
      blockMs: 15 * 60 * 1000,
    },
    refresh: {
      maxAttempts: 10,
      windowMs: 10 * 60 * 1000,
      blockMs: 10 * 60 * 1000,
    },
    forgot_password: {
      maxAttempts: 5,
      windowMs: 10 * 60 * 1000,
      blockMs: 10 * 60 * 1000,
    },
    reset_password: {
      maxAttempts: 5,
      windowMs: 10 * 60 * 1000,
      blockMs: 15 * 60 * 1000,
    },
    resend_verification: {
      maxAttempts: 5,
      windowMs: 10 * 60 * 1000,
      blockMs: 10 * 60 * 1000,
    },
  };

  private readonly buckets = new Map<string, Bucket>();

  assertAllowed(rule: RuleKey, key: string): void {
    const compositeKey = this.buildKey(rule, key);
    const now = Date.now();
    const bucket = this.buckets.get(compositeKey);

    if (!bucket) {
      return;
    }

    if (bucket.blockedUntil > now) {
      throw new HttpException(
        "Too many attempts. Please try again later.",
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    if (bucket.resetAt <= now) {
      this.buckets.delete(compositeKey);
    }
  }

  recordSuccess(rule: RuleKey, key: string): void {
    const compositeKey = this.buildKey(rule, key);
    this.buckets.delete(compositeKey);
  }

  recordFailure(rule: RuleKey, key: string): void {
    const compositeKey = this.buildKey(rule, key);
    const ruleConfig = this.rules[rule];
    const now = Date.now();
    const existing = this.buckets.get(compositeKey);

    if (!existing || existing.resetAt <= now) {
      this.buckets.set(compositeKey, {
        count: 1,
        resetAt: now + ruleConfig.windowMs,
        blockedUntil: 0,
      });
      return;
    }

    const nextCount = existing.count + 1;
    const blockedUntil =
      nextCount >= ruleConfig.maxAttempts ? now + ruleConfig.blockMs : existing.blockedUntil;

    this.buckets.set(compositeKey, {
      ...existing,
      count: nextCount,
      blockedUntil,
    });
  }

  private buildKey(rule: RuleKey, key: string): string {
    return `${rule}:${key.trim().toLowerCase()}`;
  }
}
