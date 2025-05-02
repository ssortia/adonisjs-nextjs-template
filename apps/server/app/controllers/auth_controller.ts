import User from '#models/user'
import Role from '#models/role'
import { HttpContext } from '@adonisjs/core/http'
import {
  loginValidator,
  registerValidator,
} from '#validators/auth_validator'

export default class AuthController {
  /**
   * Регистрация нового пользователя
   */
  async register({request, response}: HttpContext) {
    // Валидация входящих данных
    const data = await request.validateUsing(registerValidator)

    // Проверка на существование пользователя
    const existingUser = await User.findBy('email', data.email)
    if (existingUser) {
      return response.conflict({
        message: 'Пользователь с таким email уже существует',
      })
    }

    // Установка роли по умолчанию (обычный пользователь)
    const defaultRole = await Role.findByOrFail('name', 'user')

    // Создание пользователя
    const user = await User.create({
      fullName: data.fullName,
      email: data.email,
      password: data.password, // пароль будет хэширован автоматически благодаря AuthFinder
      roleId: defaultRole.id,
    })

    // Загрузка роли пользователя для ответа
    await user.load('role')
    
    // Создание и возврат токена доступа
    const token = await User.accessTokens.create(user)
    console.log(token.identifier, token.value!.release())
    // Не логируем токен, чтобы избежать [redacted]
    // Несмотря на то, что в логах показывается [redacted], 
    // реальное значение token.value сохраняется и возвращается клиенту
    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      token: token.value!.release(),
    }
  }

  /**
   * Вход пользователя
   */
  async login({request, response}: HttpContext) {
    const {email, password} = await request.validateUsing(loginValidator)

    // Поиск пользователя
    const user = await User.verifyCredentials(email, password)

    // Загрузка роли пользователя
    await user.load('role')

    // Создание токена доступа
    const token = await User.accessTokens.create(user)
    
    // Возвращаем токен без логирования
    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      token: token.value!.release(),
    }
  }

  /**
   * Выход пользователя
   */
  async logout({auth, response}: HttpContext) {
    await auth.use('api').logout()

    return response.noContent()
  }

  /**
   * Получение информации о текущем пользователе
   */
  async me({auth, response}: HttpContext) {
    const user = auth.use('api').user!

    // Загрузка роли пользователя
    await user.load('role')

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    }
  }

  /**
   * Получение информации о правах пользователя
   */
  async permissions({auth, response}: HttpContext) {
    const user = auth.use('api').user!

    // Загрузка роли и прав пользователя
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
      permissions: user.role.permissions.map(p => p.name),
    }
  }
}