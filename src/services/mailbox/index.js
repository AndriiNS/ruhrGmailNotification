// Interface the UI depends on:
//   list() -> Mailbox[]
//   connect({ provider, reconnectId?, outcome? }) -> Mailbox   (real, later: backend Gmail OAuth)
//   setChannels(id, channelIds[]) -> Mailbox, disconnect(id) -> void
// Demo (mock) or real is chosen per call, see lib/demo.js.
import { pickService } from '../../lib/demo'
import { mockMailbox } from './mockMailbox'
import { realMailbox } from './realMailbox'

export const mailboxService = pickService(mockMailbox, realMailbox)
