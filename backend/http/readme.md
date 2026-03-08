# API test files

Use these `.http` files with:

- `kulala.nvim`
- VS Code `REST Client`

## Files

- `auth.http`: auth + profile flow requests.
- `http-client.env.json`: shared environment values for tools that support it.

## Quick usage

1. Start backend (`npm run dev` in `backend/kosdok`).
2. Open `backend/http/auth.http`.
3. Run requests in order.

## Kulala request variables

- Requests are named with section headers, for example `### SIGN_IN`.
- You can reference response values with request variables:
  - `{{SIGN_IN.response.body.$.data.accessToken}}`
  - `{{SIGN_IN.response.body.$.data.refreshToken}}`

`auth.http` already maps these into:
- `@accessToken`
- `@refreshToken`

So after running `SIGN_IN`, protected requests can reuse tokens automatically.

This file uses both naming styles for compatibility:

- `### SIGN_IN` (Kulala-friendly)
- `# @name SIGN_IN` (REST Client-friendly)

## Cross-file strategy

- For shared constants/secrets, use environment files (`.env`, `http-client.env.json`) and reference with `{{VAR_NAME}}`.
- For request chains across files, use Kulala `import` in a runner file and execute named requests from there.

For VS Code teams, keep request dependencies in the same file when possible (named request references are always reliable there).
