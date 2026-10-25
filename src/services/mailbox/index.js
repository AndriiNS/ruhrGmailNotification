// Interface the UI depends on (same in demo and real mode):
//   list() -> Mailbox[]
//   connect({ provider, reconnectId?, outcome? }) -> Mailbox   (real: redirect to backend OAuth start,
//        e.g. Gmail API via Google OAuth; later Microsoft Graph and vetted IMAP providers)
//   setChannels(id, channelIds[]) -> Mailbox
//   disconnect(id) -> void   (real: revoke access and delete stored tokens)
import { DEMO_MODE } from '../../lib/config'
import { mockMailbox } from './mockMailbox'
import { MailboxServiceError } from './errors'

const notConfigured = async () => {
  throw new MailboxServiceError('not_configured')
}

export const mailboxService = DEMO_MODE
  ? mockMailbox
  : { list: notConfigured, connect: notConfigured, setChannels: notConfigured, disconnect: notConfigured }
