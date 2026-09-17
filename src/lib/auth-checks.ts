export const ALLOWED_EMAIL_EXCEPTION = 'akshar.scms@gmail.com'
export const ALLOWED_DOMAIN = '@nirmauni.ac.in'

/**
 * Validates whether an email address is allowed access to the Cohort'26 Placement Hub.
 * Rule:
 * - Must end with '@nirmauni.ac.in'
 * - OR match the explicit exception 'akshar.scms@gmail.com'
 */
export function isEmailAllowed(email: string | null | undefined): boolean {
  if (!email) return false
  const normalized = email.trim().toLowerCase()
  if (normalized === ALLOWED_EMAIL_EXCEPTION.toLowerCase()) {
    return true
  }
  return normalized.endsWith(ALLOWED_DOMAIN.toLowerCase())
}
