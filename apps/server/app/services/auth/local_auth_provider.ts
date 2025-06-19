import { inject } from '@adonisjs/core'
import User from '#models/user'
import {
  AuthProvider,
  AuthenticationCredentials,
  AuthenticationResult,
  RegistrationData,
} from '#contracts/auth'
import { UserRepository } from '#repositories/user_repository'
import { TokenService } from '#services/token_service'
import {
  UserBlockedException,
  EmailNotVerifiedException,
  EmailExistsException,
  UserNoRoleException,
  InvalidCredentialsException,
} from '#exceptions/auth_exceptions'

@inject()
export class LocalAuthProvider implements AuthProvider {
  constructor(
    private userRepository: UserRepository,
    private tokenService: TokenService
  ) {}

  async authenticate(credentials: AuthenticationCredentials): Promise<AuthenticationResult> {
    console.log(1)
    let user

    try {
      user = await User.verifyCredentials(credentials.email, credentials.password)
    } catch (error) {
      throw new InvalidCredentialsException()
    }

    this.validateUser(user)

    await user.load('role')
    const token = await this.tokenService.generateAccessToken(user)

    return { user, token }
  }

  async register(data: RegistrationData): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email)
    if (existingUser) {
      throw new EmailExistsException()
    }

    return this.userRepository.create({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    })
  }

  async getUserPermissions(user: User): Promise<{ role: string; permissions: string[] }> {
    await user.load('role', (query) => {
      query.preload('permissions')
    })

    if (!user.role) {
      throw new UserNoRoleException()
    }

    return {
      role: user.role.name,
      permissions: user.role.permissions.map((p) => p.name),
    }
  }

  private validateUser(user: User): void {
    if (user.blocked) {
      throw new UserBlockedException()
    }

    if (!user.isEmailVerified) {
      throw new EmailNotVerifiedException()
    }
  }
}
