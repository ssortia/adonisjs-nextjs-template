import { HttpContext } from '@adonisjs/core/http'
import type { GithubDriver } from '@adonisjs/ally/drivers/github'
import { UserRepository } from '#repositories/user_repository'
import { ValidationService } from '#services/validation_service'
import { TokenService } from '#services/token_service'
import { inject } from '@adonisjs/core'
import User from '#models/user'

export interface GitHubUser {
  id: string
  name?: string
  nickName?: string
  email: string
}

export interface OAuthResult {
  success: boolean
  token?: string
  error?: string
  redirectUrl?: string
}

@inject()
export class OAuthService {
  constructor(
    protected userRepository: UserRepository,
    protected validationService: ValidationService,
    protected tokenService: TokenService
  ) {}

  async handleGitHubCallback(context: HttpContext): Promise<OAuthResult> {
    const { ally } = context
    const github = ally.use('github') as GithubDriver

    try {
      const error = this.getOAuthError(github)
      if (error) return { success: false, error }

      const githubUser = await github.user()
      const githubId = githubUser.id.toString()
      const email = githubUser.email

      let user = await this.userRepository.findByGitHub(githubId, email)

      user = user
        ? await this.userRepository.updateGitHubInfo(user, githubId)
        : await this.createUserFromGitHub(githubUser)

      this.validationService.validateUserNotBlocked(user)

      const token = await this.tokenService.generateAccessToken(user)
      const redirectUrl = `${process.env.CLIENT_URL}/auth/callback?token=${token}`

      return { success: true, token, redirectUrl }

    } catch (error) {
      console.error('GitHub OAuth error:', error)
      return { success: false, error: 'OAuth authentication failed' }
    }
  }

  private getOAuthError(github: GithubDriver): string | null {
    if (github.accessDenied())
      return 'Access was denied'

    if (github.hasError())
      return github.getError() || 'Unknown OAuth error'

    return null
  }

  private async createUserFromGitHub(githubUser: GitHubUser): Promise<User> {
    return this.userRepository.create({
      fullName: githubUser.name || githubUser.nickName || 'GitHub User',
      email: githubUser.email,
      githubId: githubUser.id.toString(),
      provider: 'github',
      isEmailVerified: true,
    })
  }

  getGitHubRedirectUrl(context: HttpContext): Promise<void> {
    const { ally } = context
    const github = ally.use('github') as GithubDriver
    return github.redirect()
  }
}
