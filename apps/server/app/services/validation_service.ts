import User from '#models/user'
import { inject } from '@adonisjs/core'

@inject()
export class ValidationService {
  validateUserNotBlocked(user: User): void {
    if (user.blocked) {
      throw new Error('USER_BLOCKED')
    }
  }

  validateEmailVerified(user: User): void {
    if (!user.isEmailVerified) {
      throw new Error('EMAIL_NOT_VERIFIED')
    }
  }

  async validateEmailNotExists(email: string): Promise<void> {
    const existingUser = await User.findBy('email', email)
    if (existingUser) {
      throw new Error('EMAIL_ALREADY_EXISTS')
    }
  }

  validateRequiredFields(data: any, fields: string[]): void {
    for (const field of fields) {
      if (!data[field]) {
        throw new Error(`FIELD_REQUIRED: ${field}`)
      }
    }
  }
}