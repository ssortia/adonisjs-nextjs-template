import mail from '@adonisjs/mail/services/main'
import { BaseMail } from '@adonisjs/mail'

export class EmailService {
  async send(mailInstance: BaseMail) {
    try {
      await mail.send(mailInstance)
    } catch (error) {
      console.log('Email sending failed:', error.message)
    }
  }
}
