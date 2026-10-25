import LegalPage from '../components/legal/LegalPage'

const sections = [
  { heading: 'Who we are', paragraphs: ['MailPing is operated by [company name, address, registration number]. Contact: [privacy contact email].'] },
  { heading: 'What we process', paragraphs: [
    'Account data: your email address and sign-in details handled by our authentication provider.',
    'Mailbox connections: the address of each connected mailbox and the access token Google issues to us.',
    'Email details: for each new email we read the sender, subject and time in order to send your alert. We do not read message text or attachments.',
    'Channel data: your Telegram chat identifier, and delivery results for alerts.',
    'Billing: payments are processed by Stripe. We do not see or store your card details; we keep your subscription status.',
  ] },
  { heading: 'Why we process it', paragraphs: ['To provide the alert service you subscribed to, to bill you, to keep the service secure and to answer your requests. [Legal bases to be confirmed.]'] },
  { heading: 'Google user data', paragraphs: ['MailPing’s use and transfer of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements. [Wording to be verified against the current policy before launch.]'] },
  { heading: 'Who receives data', paragraphs: ['Service providers act for us: Google (mailbox access), Telegram (alert delivery; alerts pass through Telegram’s servers), Stripe (payments), [hosting and database provider]. [Complete and verify this list.]'] },
  { heading: 'How long we keep it', paragraphs: ['[Retention periods to be defined, including for delivery logs and after account deletion.]'] },
  { heading: 'Your rights', paragraphs: ['Where the GDPR applies you can ask for access, correction, deletion, restriction, portability, and you can object to processing. You can also complain to your data protection authority. Write to [privacy contact email].'] },
  { heading: 'Withdrawing access', paragraphs: ['You can disconnect a mailbox in MailPing at any time, and withdraw Google access in your Google account permissions.'] },
]

export default function PrivacyPage() {
  return <LegalPage title="Privacy Policy" sections={sections} />
}
