import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Role from '#models/role'
import { loginValidator, registerValidator } from '#validators/auth_validator'
import { EmailService } from '#services/email_service'
import VerificationEmailNotification from '#mails/verification_email_notification'
import { inject } from '@adonisjs/core'

@inject()
export default class AuthController {
  constructor(protected mail: EmailService) {}

  /**
   * Регистрация нового пользователя
   */
  async register({ request, response }: HttpContext) {
    const data = await request.validateUsing(registerValidator)
    const existingUser = await User.findBy('email', data.email)

    if (existingUser) {
      return response.conflict({ message: 'Пользователь с таким email уже существует' })
    }

    const defaultRole = await Role.findByOrFail('name', 'user')
    const emailVerificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    const user = await User.create({
      fullName: data.fullName,
      email: data.email,
      password: data.password, // пароль будет хэширован автоматически благодаря AuthFinder
      roleId: defaultRole.id,
      blocked: false,
      isEmailVerified: false,
      emailVerificationToken,
    })

    await this.mail.send(new VerificationEmailNotification(user, emailVerificationToken))
    await user.load('role')

    return {
      message: 'Регистрация успешна! Проверьте вашу почту для подтверждения аккаунта.',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        blocked: user.blocked,
        isEmailVerified: user.isEmailVerified,
        role: user.role,
      },
    }
  }

  /**
   * Вход пользователя
   */
  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    // Поиск пользователя
    const user = await User.verifyCredentials(email, password)

    // Проверка на блокировку
    if (user.blocked) {
      return response.forbidden({
        message: 'Ваш аккаунт заблокирован. Обратитесь к администратору',
      })
    }

    if (!user.isEmailVerified) {
      return response.forbidden({
        message: 'Пожалуйста, подтвердите ваш email адрес перед входом в систему',
      })
    }

    await user.load('role')
    const token = await User.accessTokens.create(user)

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        blocked: user.blocked,
        isEmailVerified: user.isEmailVerified,
        role: user.role,
      },
      token: token.value!.release(),
    }
  }

  /**
   * Выход пользователя
   */
  async logout({ auth, response }: HttpContext) {
    // @ts-ignore
    await auth.use('api').logout()

    return response.noContent()
  }

  /**
   * Получение информации о текущем пользователе
   */
  async me({ auth, response }: HttpContext) {
    const user = auth.use('api').user!

    if (user.blocked) {
      const tokens = await User.accessTokens.all(user)
      await Promise.all(tokens.map(token => User.accessTokens.delete(user, token.identifier)))
      return response.forbidden({
        message: 'Ваш аккаунт заблокирован. Обратитесь к администратору',
      })
    }

    await user.load('role')

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        blocked: user.blocked,
        role: user.role,
      },
    }
  }

  /**
   * Получение информации о правах пользователя
   */
  async permissions({ auth, response }: HttpContext) {
    const user = auth.use('api').user!
    await user.load('role', (query) => {
      query.preload('permissions')
    })

    if (!user.role) {
      return response.forbidden({
        message: 'У пользователя отсутствует роль',
      })
    }

    return {
      role: user.role.name,
      permissions: user.role.permissions.map((p) => p.name),
    }
  }
}
