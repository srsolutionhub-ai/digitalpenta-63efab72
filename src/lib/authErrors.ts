// Maps raw Supabase auth error messages/status codes to friendly, user-facing copy.
export function friendlyAuthError(error: { message?: string; status?: number; code?: string } | null | undefined): string {
  if (!error) return "Something went wrong. Please try again.";
  const msg = (error.message || "").toLowerCase();
  const status = error.status;

  if (status === 429 || msg.includes("rate limit") || msg.includes("too many requests")) {
    return "Too many attempts. Please wait a few minutes and try again.";
  }
  if (msg.includes("invalid login credentials") || msg.includes("invalid email or password")) {
    return "Incorrect email or password. Please try again.";
  }
  if (msg.includes("email not confirmed") || msg.includes("email is not confirmed")) {
    return "Please confirm your email address before signing in. Check your inbox for the confirmation link.";
  }
  if (msg.includes("user already registered") || msg.includes("already registered") || msg.includes("already been registered")) {
    return "An account with this email already exists. Try signing in instead.";
  }
  if (msg.includes("password should be at least") || msg.includes("password is too short")) {
    return "Your password is too short. Please use at least 8 characters.";
  }
  if (msg.includes("signup requires a valid password") || msg.includes("password")) {
    return "Please choose a stronger password.";
  }
  if (msg.includes("invalid or expired") || msg.includes("expired") || msg.includes("otp_expired")) {
    return "This link has expired or has already been used. Please request a new one.";
  }
  if (msg.includes("network")) {
    return "Network error. Please check your connection and try again.";
  }

  // Fall back to the raw message rather than a generic string, so unexpected
  // Supabase errors are still visible for debugging.
  return error.message || "Something went wrong. Please try again.";
}

export type PasswordStrength = "weak" | "fair" | "strong";

export function getPasswordStrength(password: string): PasswordStrength {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return "weak";
  if (score <= 3) return "fair";
  return "strong";
}
