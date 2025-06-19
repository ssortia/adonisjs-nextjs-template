import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export class UserBlockedException extends Exception {
  static status = 403
  static code = 'E_USER_BLOCKED'

  async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).send({
      message: 'Ваш аккаунт заблокирован. Обратитесь к администратору',
      code: error.code,
    })
  }
}

export class EmailNotVerifiedException extends Exception {
  static status = 403
  static code = 'E_EMAIL_NOT_VERIFIED'

  async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).send({
      message: 'Пожалуйста, подтвердите ваш email адрес перед входом в систему',
      code: error.code,
    })
  }
}

export class EmailExistsException extends Exception {
  static status = 409
  static code = 'E_EMAIL_EXISTS'

  async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).send({
      message: 'Пользователь с таким email уже существует',
      code: error.code,
    })
  }
}

export class UserNotFoundException extends Exception {
  static status = 404
  static code = 'E_USER_NOT_FOUND'

  async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).send({
      message: 'Пользователь не найден',
      code: error.code,
    })
  }
}

export class InvalidCredentialsException extends Exception {
  static status = 400
  static code = 'E_INVALID_CREDENTIALS'

  async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).send({
      message: 'Неверные учетные данные',
      code: error.code,
    })
  }
}

export class OAuthException extends Exception {
  static status = 400
  static code = 'E_OAUTH_ERROR'

  async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).send({
      message: error.message || 'Ошибка OAuth аутентификации',
      code: error.code,
    })
  }
}

export class UserNoRoleException extends Exception {
  static status = 403
  static code = 'E_USER_NO_ROLE'

  async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).send({
      message: 'У пользователя отсутствует роль',
      code: error.code,
    })
  }
}
