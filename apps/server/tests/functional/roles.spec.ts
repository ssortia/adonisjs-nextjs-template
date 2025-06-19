import { test } from '@japa/runner'
import { UserFactory, RoleFactory, PermissionFactory } from '#database/factories/index'
import db from '@adonisjs/lucid/services/db'

test.group('Roles CRUD', (group) => {
  group.each.setup(async () => {
    await db.beginGlobalTransaction()
  })

  group.each.teardown(async () => {
    await db.rollbackGlobalTransaction()
  })

  test('should get roles list when authenticated with manage_roles permission', async ({ client, assert }) => {
    // Create admin role with manage_roles permission
    const manageRolesPermission = await PermissionFactory.merge({ name: 'manage_roles' }).create()
    const adminRole = await RoleFactory.merge({ name: 'admin' }).create()
    await adminRole.related('permissions').attach([manageRolesPermission.id])
    
    // Create admin user
    const adminUser = await UserFactory.merge({ roleId: adminRole.id }).create()
    const token = await adminUser.currentAccessToken.create(adminUser)

    // Create test roles
    await RoleFactory.createMany(3)

    const response = await client
      .get('/roles')
      .header('Authorization', `Bearer ${token.value!.release()}`)

    response.assertStatus(200)
    assert.isArray(response.body().data)
    assert.isAtLeast(response.body().data.length, 3)
  })

  test('should fail to get roles without manage_roles permission', async ({ client }) => {
    // Create user without manage_roles permission
    const role = await RoleFactory.merge({ name: 'user' }).create()
    const user = await UserFactory.merge({ roleId: role.id }).create()
    const token = await user.currentAccessToken.create(user)

    const response = await client
      .get('/roles')
      .header('Authorization', `Bearer ${token.value!.release()}`)

    response.assertStatus(403)
  })

  test('should create role when authenticated with manage_roles permission', async ({ client, assert }) => {
    // Create admin role with manage_roles permission
    const manageRolesPermission = await PermissionFactory.merge({ name: 'manage_roles' }).create()
    const adminRole = await RoleFactory.merge({ name: 'admin' }).create()
    await adminRole.related('permissions').attach([manageRolesPermission.id])
    
    // Create admin user
    const adminUser = await UserFactory.merge({ roleId: adminRole.id }).create()
    const token = await adminUser.currentAccessToken.create(adminUser)

    const roleData = {
      name: 'new_role',
      description: 'A new test role',
    }

    const response = await client
      .post('/roles')
      .header('Authorization', `Bearer ${token.value!.release()}`)
      .json(roleData)

    response.assertStatus(201)
    assert.equal(response.body().name, roleData.name)
    assert.equal(response.body().description, roleData.description)
  })

  test('should fail to create role with duplicate name', async ({ client }) => {
    // Create admin role with manage_roles permission
    const manageRolesPermission = await PermissionFactory.merge({ name: 'manage_roles' }).create()
    const adminRole = await RoleFactory.merge({ name: 'admin' }).create()
    await adminRole.related('permissions').attach([manageRolesPermission.id])
    
    // Create admin user
    const adminUser = await UserFactory.merge({ roleId: adminRole.id }).create()
    const token = await adminUser.currentAccessToken.create(adminUser)

    // Create existing role
    const existingRole = await RoleFactory.create()

    const roleData = {
      name: existingRole.name, // Same name
      description: 'A duplicate role',
    }

    const response = await client
      .post('/roles')
      .header('Authorization', `Bearer ${token.value!.release()}`)
      .json(roleData)

    response.assertStatus(422)
  })

  test('should update role when authenticated with manage_roles permission', async ({ client, assert }) => {
    // Create admin role with manage_roles permission
    const manageRolesPermission = await PermissionFactory.merge({ name: 'manage_roles' }).create()
    const adminRole = await RoleFactory.merge({ name: 'admin' }).create()
    await adminRole.related('permissions').attach([manageRolesPermission.id])
    
    // Create admin user
    const adminUser = await UserFactory.merge({ roleId: adminRole.id }).create()
    const token = await adminUser.currentAccessToken.create(adminUser)

    // Create target role
    const targetRole = await RoleFactory.create()

    const updateData = {
      name: 'updated_role',
      description: 'Updated description',
    }

    const response = await client
      .put(`/roles/${targetRole.id}`)
      .header('Authorization', `Bearer ${token.value!.release()}`)
      .json(updateData)

    response.assertStatus(200)
    assert.equal(response.body().name, updateData.name)
    assert.equal(response.body().description, updateData.description)
  })

  test('should delete role when authenticated with manage_roles permission', async ({ client }) => {
    // Create admin role with manage_roles permission
    const manageRolesPermission = await PermissionFactory.merge({ name: 'manage_roles' }).create()
    const adminRole = await RoleFactory.merge({ name: 'admin' }).create()
    await adminRole.related('permissions').attach([manageRolesPermission.id])
    
    // Create admin user
    const adminUser = await UserFactory.merge({ roleId: adminRole.id }).create()
    const token = await adminUser.currentAccessToken.create(adminUser)

    // Create target role
    const targetRole = await RoleFactory.create()

    const response = await client
      .delete(`/roles/${targetRole.id}`)
      .header('Authorization', `Bearer ${token.value!.release()}`)

    response.assertStatus(204)
  })

  test('should assign permissions to role', async ({ client, assert }) => {
    // Create admin role with manage_roles permission
    const manageRolesPermission = await PermissionFactory.merge({ name: 'manage_roles' }).create()
    const adminRole = await RoleFactory.merge({ name: 'admin' }).create()
    await adminRole.related('permissions').attach([manageRolesPermission.id])
    
    // Create admin user
    const adminUser = await UserFactory.merge({ roleId: adminRole.id }).create()
    const token = await adminUser.currentAccessToken.create(adminUser)

    // Create target role and permissions
    const targetRole = await RoleFactory.create()
    const permissions = await PermissionFactory.createMany(3)

    const response = await client
      .put(`/roles/${targetRole.id}`)
      .header('Authorization', `Bearer ${token.value!.release()}`)
      .json({
        name: targetRole.name,
        description: targetRole.description,
        permissionIds: permissions.map(p => p.id),
      })

    response.assertStatus(200)
    
    // Verify permissions were assigned
    await targetRole.load('permissions')
    assert.equal(targetRole.permissions.length, 3)
  })
})