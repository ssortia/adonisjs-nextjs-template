import { HttpContext } from '@adonisjs/core/http'
import { OAuthService } from '#services/oauth_service'
import { inject } from '@adonisjs/core'

@inject()
export default class OAuthController {
  constructor(protected oauthService: OAuthService) {}

  /**
   * @githubRedirect
   * @tag OAuth
   * @summary Redirect to GitHub OAuth
   * @description Redirects user to GitHub OAuth authorization
   * @responseBody 302 - Redirect to GitHub
   */
  async githubRedirect(context: HttpContext) {
    return this.oauthService.getGitHubRedirectUrl(context)
  }

  /**
   * @githubCallback
   * @tag OAuth
   * @summary GitHub OAuth callback
   * @description Handles GitHub OAuth callback and creates/authenticates user
   * @responseBody 200 - {"user": {"id": 1, "email": "john@example.com", "fullName": "John Doe"}, "token": "oat_MjI.abc123xyz..."}
   * @responseBody 400 - {"message": "OAuth authentication failed"}
   */
  async githubCallback(context: HttpContext) {
    const { response } = context
    const result = await this.oauthService.handleGitHubCallback(context)

    if (!result.success) {
      return response.badRequest({ message: result.error })
    }

    if (result.redirectUrl) {
      return response.redirect(result.redirectUrl)
    }

    return response.badRequest({ message: 'OAuth authentication failed' })
  }
}