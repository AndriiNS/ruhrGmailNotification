export class AuthServiceError extends Error {
  constructor(code) {
    super(code)
    this.code = code
  }
}

const messages = {
  invalid_credentials: 'The email or password is incorrect. Check them and try again.',
  email_taken: 'An account with this email already exists. Sign in instead.',
  network: 'We could not reach the server. Check your connection and try again.',
  not_configured: 'Authentication is not set up yet.',
  email_not_confirmed: 'Confirm your email first. Open the link we sent you, or request a new one.',
  weak_password: 'This password is too weak. Use at least 8 characters and avoid common passwords.',
  rate_limited: 'Too many attempts. Wait a few minutes and try again.',
}

export const authErrorMessage = (code) =>
  messages[code] || 'Something went wrong. Try again in a moment.'
