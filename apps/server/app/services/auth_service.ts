import { UserRepository } from '#repositories/user_repository'
import { ValidationService } from '#services/validation_service'
import { TokenService } from '#services/token_service'
import { inject } from '@adonisjs/core'
import User from '#models/user'

@inject()
export class AuthService {
  constructor(
    protected userRepository: UserRepository,
    protected validationService: ValidationService,
    protected tokenService: TokenService
  ) {}

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.verifyCredentials(email, password)

    this.validationService.validateUserNotBlocked(user)
    this.validationService.validateEmailVerified(user)

    await user.load('role')
    const token = await this.tokenService.generateAccessToken(user)

    return { user, token }
  }

  async register(fullName: string, email: string, password: string): Promise<User> {
    await this.validationService.validateEmailNotExists(email)

    return await this.userRepository.create({
      fullName,
      email,
      password,
    })
  }

  async getUserPermissions(user: User): Promise<{ role: string; permissions: string[] }> {
    await user.load('role', (query) => {
      query.preload('permissions')
    })

    if (!user.role) {
      throw new Error('USER_NO_ROLE')
    }

    return {
      role: user.role.name,
      permissions: user.role.permissions.map((p) => p.name),
    }
  }

  async logout(): Promise<void> {
    // Logout will be handled by the auth middleware/guard
  }
}