import User from '#models/user'
import Role from '#models/role'
import { EmailService } from '#services/email_service'
import VerificationEmailNotification from '#mails/verification_email_notification'
import { inject } from '@adonisjs/core'

export interface CreateUserData {
  fullName: string
  email: string
  password?: string
  githubId?: string
  provider?: string
  isEmailVerified?: boolean
}

export interface UserResponse {
  id: number
  email: string
  fullName: string
  blocked: boolean
  isEmailVerified?: boolean
  role: any
}

@inject()
export class UserRepository {
  constructor(protected emailService: EmailService) {}

  async findByEmail(email: string): Promise<User | null> {
    return User.findBy('email', email)
  }

  async findByGitHub(githubId: string, email: string): Promise<User | null> {
    return User.query().where('github_id', githubId).orWhere('email', email).preload('role').first()
  }

  async verifyCredentials(email: string, password: string): Promise<User> {
    return User.verifyCredentials(email, password)
  }

  async create(data: CreateUserData): Promise<User> {
    const defaultRole = await Role.findByOrFail('name', 'user')
    const emailVerificationToken = this.generateEmailVerificationToken()

    const user = await User.create({
      fullName: data.fullName,
      email: data.email,
      password: data.password || Math.random().toString(36),
      githubId: data.githubId,
      provider: data.provider,
      roleId: defaultRole.id,
      blocked: false,
      isEmailVerified: data.isEmailVerified ?? false,
      emailVerificationToken: data.isEmailVerified ? undefined : emailVerificationToken,
    })

    if (!data.isEmailVerified && emailVerificationToken) {
      await this.emailService.send(new VerificationEmailNotification(user, emailVerificationToken))
    }

    await user.load('role')
    return user
  }

  async updateGitHubInfo(user: User, githubId: string): Promise<User> {
    if (!user.githubId) {
      user.githubId = githubId
      user.provider = 'github'
      await user.save()
    }
    return user
  }

  private generateEmailVerificationToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }
}
