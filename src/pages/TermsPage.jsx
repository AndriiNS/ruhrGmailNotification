import LegalPage from '../components/legal/LegalPage'

const sections = [
  { heading: 'The service', paragraphs: ['MailPing notifies you in Telegram when new email arrives in mailboxes you connect. It is not an email client and does not let you read or manage mail.'] },
  { heading: 'Your account', paragraphs: ['You are responsible for your account and for the mailboxes you connect. Connect only mailboxes you are entitled to use. Up to 3 mailboxes are included in one subscription.'] },
  { heading: 'Subscription and payment', paragraphs: ['The subscription costs €1.99 per month [tax treatment to be confirmed]. Payments are handled by Stripe. You can cancel at any time in the billing portal; alerts continue until the end of the paid period. [Refund terms to be defined.]'] },
  { heading: 'No guarantee of delivery', paragraphs: ['Alerts depend on third-party services such as Google and Telegram and are provided on a best-effort basis. Delays or missed alerts can happen. Do not rely on MailPing for time-critical or safety-critical messages.'] },
  { heading: 'Acceptable use', paragraphs: ['Do not misuse the service, attempt to disrupt it, or use it to access mailboxes you do not control.'] },
  { heading: 'Ending the service', paragraphs: ['You can delete your account at any time. We may suspend accounts that break these terms. [Notice and termination details to be defined.]'] },
  { heading: 'Liability and governing law', paragraphs: ['[Liability limits and governing law to be drafted and reviewed by a lawyer.]'] },
  { heading: 'Contact', paragraphs: ['[Company name, address, contact email].'] },
]

export default function TermsPage() {
  return <LegalPage title="Terms of Service" sections={sections} />
}
