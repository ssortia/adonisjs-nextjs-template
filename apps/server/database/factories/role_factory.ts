import factory from '@adonisjs/lucid/factories'
import Role from '#models/role'
import PermissionFactory from './permission_factory.js'

const RoleFactory = factory
  .define(Role, async ({ faker }) => {
    return {
      name: faker.helpers.arrayElement(['admin', 'user', 'moderator']),
      description: faker.lorem.sentence(),
    }
  })
  .relation('permissions', () => PermissionFactory)
  .build()

export default RoleFactory
export { RoleFactory }