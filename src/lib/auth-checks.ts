export const ALLOWED_EMAIL_EXCEPTION = 'akshar.scms@gmail.com'
export const ALLOWED_DOMAIN = '@nirmauni.ac.in'

/**
 * Whitelist of Student Placement Coordinators (SPCs)
 * Only these exact email addresses receive SPC privileges and dashboard controls.
 */
export const SPC_EMAILS = [
  '26mca061@nirmauni.ac.in',
  '26mca019@nirmauni.ac.in',
  '26mca035@nirmauni.ac.in',
  '26mca056@nirmauni.ac.in',
] as const

/**
 * Validates whether an email address is allowed access to the Cohort'26 Placement Hub.
 */
export function isEmailAllowed(email: string | null | undefined): boolean {
  if (!email) return false
  const normalized = email.trim().toLowerCase()
  if (normalized === ALLOWED_EMAIL_EXCEPTION.toLowerCase()) {
    return true
  }
  return normalized.endsWith(ALLOWED_DOMAIN.toLowerCase())
}

/**
 * Resolves the role for a given user email.
 * Returns 'SPC' if the email is in the SPC whitelist, otherwise 'STUDENT'.
 */
export function getUserRole(email: string | null | undefined): 'SPC' | 'STUDENT' {
  if (!email) return 'STUDENT'
  const normalized = email.trim().toLowerCase()
  const isSpc = SPC_EMAILS.some((spc) => spc.toLowerCase() === normalized)
  return isSpc ? 'SPC' : 'STUDENT'
}
