export class AccountServiceError extends Error {
  constructor(code) {
    super(code)
    this.code = code
  }
}

const messages = {
  network: 'We could not reach the server. Check your connection and try again.',
  not_configured: 'Account settings are not set up yet.',
}

export const accountErrorMessage = (code) => messages[code] || 'Something went wrong. Try again in a moment.'
