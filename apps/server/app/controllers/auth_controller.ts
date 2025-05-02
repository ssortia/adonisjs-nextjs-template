import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { HttpContext } from '@adonisjs/core/http'
import { loginValidator, registerValidator } from '#validators/auth_validator'

export default class AuthController {
  /**
   * Регистрация нового пользователя
   */
  async register({ request, response }: HttpContext) {
    // Валидация входящих данных
    const data = await request.validateUsing(registerValidator)

    // Проверка на существование пользователя
    const existingUser = await User.findBy('email', data.email)
    if (existingUser) {
      return response.conflict({
        message: 'Пользователь с таким email уже существует'
      })
    }

    // Создание пользователя
    const user = await User.create({
      fullName: data.fullName,
      email: data.email,
      password: data.password, // пароль будет хэширован автоматически благодаря AuthFinder
    })

    // Создание и возврат токена доступа
    const token = await User.accessTokens.create(user)

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName
      },
      token: token.value
    }
  }

  /**
   * Вход пользователя
   */
  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    // Поиск пользователя
    const user = await User.verifyCredentials(email, password)
    
    // Создание токена доступа
    const token = await User.accessTokens.create(user)

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName
      },
      token: token.value
    }
  }

  /**
   * Выход пользователя
   */
  async logout({ auth, response }: HttpContext) {
    await auth.use('api').logout()
    
    return response.noContent()
  }

  /**
   * Получение информации о текущем пользователе
   */
  async me({ auth, response }: HttpContext) {
    const user = auth.use('api').user!
    
    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName
      }
    }
  }
}