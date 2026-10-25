export class MailboxServiceError extends Error {
  constructor(code) {
    super(code)
    this.code = code
  }
}

const messages = {
  access_denied: 'Access was not granted, so the mailbox was not connected. You can try again and approve access.',
  provider_error: 'The email provider reported a problem while connecting. Try again in a few minutes.',
  limit_reached: 'You have reached the mailbox limit. Disconnect a mailbox to add another.',
  not_configured: 'Connecting mailboxes is not set up yet.',
  network: 'We could not reach the server. Check your connection and try again.',
}

export const mailboxErrorMessage = (code) => messages[code] || 'Something went wrong. Try again in a moment.'
