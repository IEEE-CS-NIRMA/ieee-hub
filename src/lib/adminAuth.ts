import type { Session } from "@supabase/supabase-js";

const rawAdminEmails = import.meta.env.VITE_ADMIN_EMAILS as string | undefined;

const allowedAdminEmails = rawAdminEmails
  ?.split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export function isAdminSession(session: Session | null) {
  const email = session?.user?.email?.toLowerCase();

  if (!email) {
    return false;
  }

  // If no allowlist is configured, allow any authenticated user.
  if (!allowedAdminEmails || allowedAdminEmails.length === 0) {
    return true;
  }

  return allowedAdminEmails.includes(email);
}

export function getAdminEmailHint() {
  if (!allowedAdminEmails || allowedAdminEmails.length === 0) {
    return "Any authenticated account";
  }

  return allowedAdminEmails.join(", ");
}
