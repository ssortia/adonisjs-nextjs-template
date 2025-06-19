import { BusinessException } from '#exceptions/business_exceptions'

/**
 * User blocked exception
 */
export class UserBlockedException extends BusinessException {
  static status = 403
  static code = 'E_USER_BLOCKED'

  constructor(options?: ErrorOptions) {
    super('Ваш аккаунт заблокирован. Обратитесь к администратору', options)
  }

  readonly code = 'E_USER_BLOCKED'
  readonly status = 403
}

/**
 * Email not verified exception
 */
export class EmailNotVerifiedException extends BusinessException {
  static status = 403
  static code = 'E_EMAIL_NOT_VERIFIED'

  constructor(options?: ErrorOptions) {
    super('Пожалуйста, подтвердите ваш email адрес перед входом в систему', options)
  }

  readonly code = 'E_EMAIL_NOT_VERIFIED'
  readonly status = 403
}

/**
 * Email already exists exception
 */
export class EmailExistsException extends BusinessException {
  static status = 409
  static code = 'E_EMAIL_EXISTS'

  constructor(options?: ErrorOptions) {
    super('Пользователь с таким email уже существует', options)
  }

  readonly code = 'E_EMAIL_EXISTS'
  readonly status = 409
}

/**
 * User not found exception
 */
export class UserNotFoundException extends BusinessException {
  static status = 404
  static code = 'E_USER_NOT_FOUND'

  constructor(options?: ErrorOptions) {
    super('Пользователь не найден', options)
  }

  readonly code = 'E_USER_NOT_FOUND'
  readonly status = 404
}

/**
 * OAuth authentication exception
 */
export class OAuthException extends BusinessException {
  static status = 400
  static code = 'E_OAUTH_ERROR'

  constructor(message: string = 'Ошибка OAuth аутентификации', options?: ErrorOptions) {
    super(message, options)
  }

  readonly code = 'E_OAUTH_ERROR'
  readonly status = 400
}

/**
 * User has no role exception
 */
export class UserNoRoleException extends BusinessException {
  static status = 403
  static code = 'E_USER_NO_ROLE'

  constructor(options?: ErrorOptions) {
    super('У пользователя отсутствует роль', options)
  }

  readonly code = 'E_USER_NO_ROLE'
  readonly status = 403
}
