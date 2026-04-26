import { assertClientSecretConfigured } from "./lib/client-auth";

// Called by Next.js at server startup — fails fast if CLIENT_SECRET is missing
export function register() {
  assertClientSecretConfigured();
}
