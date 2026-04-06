# Identity Schemas

This folder contains the source-of-truth database schemas for the Identity module.

The schemas are intentionally separated by concern so each auth flow has clear ownership and lifecycle rules.

## `auth.schema.ts` (`auth_users`)

What it stores:

- core identity record (`id`, `email`)
- credentials (`password_hash`)
- verification state (`email_verified_at`)
- authorization claims (`roles`, `permissions`)
- timestamps (`created_at`, `updated_at`)

Why it is needed:

- this is the single identity table used by authentication and guards
- keeps auth concerns separate from profile/business data

Important rules:

- profile fields (name, city, avatar, etc.) do not belong here
- `email_verified_at` controls whether sign-in is allowed

## `auth-refresh-token.schema.ts` (`auth_refresh_tokens`)

What it stores:

- hashed refresh tokens (`token_hash`)
- owner (`user_id`)
- expiry (`expires_at`)
- revocation status (`revoked_at`)
- optional context (`user_agent`, `ip_address`)

Why it is needed:

- supports refresh-token rotation
- supports logout and session invalidation
- avoids storing raw refresh tokens in DB

Important rules:

- tokens are validated by hash lookup + not revoked + not expired
- on refresh, old token is revoked and a new one is issued

## `auth-email-verification-token.schema.ts` (`auth_email_verification_tokens`)

What it stores:

- hashed email verification token
- owner (`user_id`)
- expiry (`expires_at`)
- one-time use marker (`used_at`)

Why it is needed:

- verifies account ownership before first login
- allows resend verification by invalidating old tokens and issuing a new one

Important rules:

- only unused + unexpired tokens are valid
- successful verification marks token used and updates `auth_users.email_verified_at`

## `auth-password-reset-token.schema.ts` (`auth_password_reset_tokens`)

What it stores:

- hashed password reset token
- owner (`user_id`)
- expiry (`expires_at`)
- one-time use marker (`used_at`)

Why it is needed:

- enables secure password reset without exposing raw tokens
- supports invalidating previous reset requests when issuing a new one

Important rules:

- only unused + unexpired tokens are valid
- after successful reset, token is consumed and user refresh sessions are revoked

## Flow Overview

### Sign-up and verify

1. Create `auth_users` row with `email_verified_at = null`.
2. Create `auth_email_verification_tokens` row.
3. Send verification link.
4. Verify endpoint consumes token and sets `auth_users.email_verified_at`.

### Sign-in and refresh

1. Sign-in checks password + verified email.
2. Issue access token and refresh token.
3. Persist hashed refresh token in `auth_refresh_tokens`.
4. Refresh consumes old refresh token (revoke) and issues a new pair.

### Logout

1. Client sends refresh token.
2. Server hashes token and marks matching `auth_refresh_tokens` row revoked.

### Forgot/reset password

1. Forgot password creates `auth_password_reset_tokens` (after invalidating old active ones).
2. Reset password consumes valid token and updates password hash in `auth_users`.
3. Revoke all active refresh tokens for that user.

### Change password (authenticated)

1. Validate current password against `auth_users.password_hash`.
2. Update password hash.
3. Revoke all active refresh tokens for that user.
