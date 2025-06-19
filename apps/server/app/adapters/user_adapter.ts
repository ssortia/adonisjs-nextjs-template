import User from '#models/user'
import { UserResponse } from '#repositories/user_repository'

export class UserAdapter {
  formatUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName || '',
      blocked: user.blocked,
      isEmailVerified: user.isEmailVerified,
      role: user.role,
    }
  }
}
