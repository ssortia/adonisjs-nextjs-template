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
   * @register
   * @tag Auth
   * @summary Регистрация нового пользователя
   * @description Создает нового пользователя с отправкой письма подтверждения
   * @requestBody {"fullName": "John Doe", "email": "john@example.com", "password": "password123", "passwordConfirmation": "password123"}
   * @responseBody 201 - {"message": "Регистрация успешна! Проверьте вашу почту для подтверждения аккаунта.", "user": {"id": 1, "email": "john@example.com", "fullName": "John Doe", "blocked": false, "isEmailVerified": false, "role": {"id": 2, "name": "user", "description": "Обычный пользователь"}}}
   * @responseBody 409 - {"message": "Пользователь с таким email уже существует"}
   * @responseBody 422 - {"message": "Validation failed", "code": "E_VALIDATION_ERROR", "status": 422, "errors": [{"message": "The email field must be a valid email address", "rule": "email", "field": "email"}]}
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
   * @login
   * @tag Auth
   * @summary Вход пользователя в систему
   * @description Аутентифицирует пользователя по email и паролю, возвращает токен доступа
   * @requestBody {"email": "john@example.com", "password": "password123"}
   * @responseBody 200 - {"user": {"id": 1, "email": "john@example.com", "fullName": "John Doe", "blocked": false, "isEmailVerified": true, "role": {"id": 2, "name": "user", "description": "Обычный пользователь"}}, "token": "oat_MjI.abc123xyz..."}
   * @responseBody 403 - {"message": "Ваш аккаунт заблокирован. Обратитесь к администратору"}
   * @responseBody 422 - {"message": "Validation failed", "code": "E_VALIDATION_ERROR", "status": 422, "errors": [{"message": "The email field must be a valid email address", "rule": "email", "field": "email"}]}
   * @responseBody 400 - {"message": "Invalid credentials"}
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
   * @logout
   * @tag Auth
   * @summary Выход пользователя из систем
   * @description Деактивирует текущий токен доступа
   * @security BearerAuth
   * @responseBody 204 - ""
   * @responseBody 401 - {"message": "Требуется аутентификация"}
   */
  async logout({ auth, response }: HttpContext) {
    // @ts-ignore
    await auth.use('api').logout()

    return response.noContent()
  }

  /**
   * @me
   * @tag Auth
   * @summary Получение информации о текущем пользователе
   * @description Возвращает информацию о текущем аутентифицированном пользователе с ролью
   * @security BearerAuth
   * @responseBody 200 - {"user": {"id": 1, "email": "john@example.com", "fullName": "John Doe", "blocked": false, "role": {"id": 2, "name": "user", "description": "Обычный пользователь"}}}
   * @responseBody 401 - {"message": "Требуется аутентификация"}
   * @responseBody 403 - {"message": "Ваш аккаунт заблокирован. Обратитесь к администратору"}
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
   * @permissions
   * @tag Auth
   * @summary Получение прав пользователя
   * @description Возвращает роль и список всех разрешений текущего пользователя
   * @security BearerAuth
   * @responseBody 200 - {"role": "admin", "permissions": ["users.view", "users.create", "users.edit", "users.delete", "roles.view"]}
   * @responseBody 401 - {"message": "Требуется аутентификация"}
   * @responseBody 403 - {"message": "У пользователя отсутствует роль"}
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
