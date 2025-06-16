import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { EmailService } from '#services/email_service'
import VerificationEmailNotification from '#mails/verification_email_notification'

export default class EmailVerificationsController {
  async verify({ params, response }: HttpContext) {
    const token = params.token
    const user = await User.findBy('emailVerificationToken', token)
    if (!user) {
      return response.badRequest({
        message: 'Недействительный или истекший токен подтверждения',
      })
    }

    user.isEmailVerified = true
    user.emailVerificationToken = null
    await user.save()

    return response.ok({
      message: 'Email успешно подтвержден',
    })
  }

  async resend({ request, response }: HttpContext) {
    const { email } = request.only(['email'])

    const user = await User.findBy('email', email)
    if (!user) {
      return response.badRequest({
        message: 'Пользователь с таким email не найден',
      })
    }

    if (user.isEmailVerified) {
      return response.badRequest({
        message: 'Email уже подтвержден',
      })
    }

    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    user.emailVerificationToken = token
    await user.save()

    const emailService = new EmailService()
    const verificationEmail = new VerificationEmailNotification(user, token)
    await emailService.send(verificationEmail)

    return response.ok({
      message: 'Письмо для подтверждения отправлено повторно',
    })
  }
}