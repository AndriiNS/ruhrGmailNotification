// Each validator returns an error message, or '' when the value is valid.
export const MIN_PASSWORD_LENGTH = 8

export function validateEmail(value) {
  const v = value.trim()
  if (!v) return 'Enter your email address.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Enter a valid email address, like name@example.com.'
  return ''
}

export function validateNewPassword(value) {
  if (!value) return 'Create a password.'
  if (value.length < MIN_PASSWORD_LENGTH) return `Use at least ${MIN_PASSWORD_LENGTH} characters.`
  return ''
}

export function validatePasswordMatch(password, confirm) {
  if (!confirm) return 'Repeat your password.'
  return password === confirm ? '' : 'The passwords do not match.'
}
