// Input sanitization utilities

/**
 * Sanitize string input (remove HTML tags, trim)
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>]/g, '') // Remove remaining brackets
}

/**
 * Sanitize email
 */
export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/**
 * Sanitize phone number
 */
export function sanitizePhone(phone: string): string {
  return phone.trim().replace(/\D/g, '') // Remove non-digits
}

/**
 * Sanitize object with string values
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj }
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeString(sanitized[key] as string) as T[Extract<keyof T, string>]
    }
  }
  return sanitized
}
