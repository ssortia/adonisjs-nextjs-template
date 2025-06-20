import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Role from '#models/role'
import hash from '@adonisjs/core/services/hash'

export default class AdminUserSeeder extends BaseSeeder {
  static environment = ['development', 'test']

  async run() {
    const adminRole = await Role.findBy('name', 'admin')

    await User.create({
      fullName: 'Test Admin',
      email: 'test@mail.ru',
      password: '123123',
      isEmailVerified: true,
      blocked: false,
      roleId: adminRole!.id,
    })
  }
}
