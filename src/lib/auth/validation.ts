const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[a-zA-Z0-9._-]+$/;

export const MIN_PASSWORD_LENGTH = 8;

export function validateUserName(value: string): string | undefined {
  const v = value.trim();
  if (!v) return "Username is required.";
  if (v.length < 3) return "Username must be at least 3 characters.";
  if (v.length > 50) return "Username must be 50 characters or fewer.";
  if (!USERNAME_PATTERN.test(v)) return "Use letters, numbers, dots, dashes or underscores only.";
}

export function validateEmail(value: string): string | undefined {
  const v = value.trim();
  if (!v) return "Email is required.";
  if (!EMAIL_PATTERN.test(v)) return "Enter a valid email address.";
}

export function validatePassword(value: string): string | undefined {
  if (!value) return "Password is required.";
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
}

/** Scores a password from 0 (empty) to 4 (strong). */
export function passwordStrength(value: string): 0 | 1 | 2 | 3 | 4 {
  if (!value) return 0;
  let score = 0;
  if (value.length >= MIN_PASSWORD_LENGTH) score++;
  if (value.length >= 12) score++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
  if (/\d/.test(value) && /[^a-zA-Z0-9]/.test(value)) score++;
  return Math.max(1, score) as 1 | 2 | 3 | 4;
}
