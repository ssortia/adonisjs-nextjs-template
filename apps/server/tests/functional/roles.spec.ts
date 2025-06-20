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

  test('should get roles list when authenticated with manage_roles permission', async ({
    client,
    assert,
  }) => {
    // Create test role with manage_roles permission
    const manageRolesPermission = await PermissionFactory.merge({ name: 'manage_roles' }).create()
    const testRole = await RoleFactory.merge({ name: 'test' }).create()
    await testRole.related('permissions').attach([manageRolesPermission.id])

    // Create test user
    const testUser = await UserFactory.merge({ roleId: testRole.id }).create()
    const token = await testUser.currentAccessToken.create(testUser)

    // Create test roles
    await RoleFactory.createMany(3)

    const response = await client
      .get('/api/roles')
      .header('Authorization', `Bearer ${token.value!.release()}`)

    response.assertStatus(200)
    assert.isArray(response.body().data)
    assert.isAtLeast(response.body().data.length, 3)
  })

  test('should fail to get roles without manage_roles permission', async ({ client }) => {
    // Create user without manage_roles permission
    const role = await RoleFactory.merge({ name: 'user_test' }).create()
    const user = await UserFactory.merge({ roleId: role.id }).create()
    const token = await user.currentAccessToken.create(user)

    const response = await client
      .get('/api/roles')
      .header('Authorization', `Bearer ${token.value!.release()}`)

    response.assertStatus(403)
  })

  test('should create role when authenticated with manage_roles permission', async ({
    client,
    assert,
  }) => {
    // Create test role with manage_roles permission
    const manageRolesPermission = await PermissionFactory.merge({ name: 'manage_roles' }).create()
    const testRole = await RoleFactory.merge({ name: 'test' }).create()
    await testRole.related('permissions').attach([manageRolesPermission.id])

    // Create test user
    const testUser = await UserFactory.merge({ roleId: testRole.id }).create()
    const token = await testUser.currentAccessToken.create(testUser)

    const roleData = {
      name: 'new_role',
      description: 'A new test role',
    }

    const response = await client
      .post('/api/roles')
      .header('Authorization', `Bearer ${token.value!.release()}`)
      .json(roleData)

    response.assertStatus(201)
    assert.equal(response.body().name, roleData.name)
    assert.equal(response.body().description, roleData.description)
  })

  test('should fail to create role with duplicate name', async ({ client }) => {
    // Create test role with manage_roles permission
    const manageRolesPermission = await PermissionFactory.merge({ name: 'manage_roles' }).create()
    const testRole = await RoleFactory.merge({ name: 'test' }).create()
    await testRole.related('permissions').attach([manageRolesPermission.id])

    // Create test user
    const testUser = await UserFactory.merge({ roleId: testRole.id }).create()
    const token = await testUser.currentAccessToken.create(testUser)

    // Create existing role
    const existingRole = await RoleFactory.create()

    const roleData = {
      name: existingRole.name, // Same name
      description: 'A duplicate role',
    }

    const response = await client
      .post('/api/roles')
      .header('Authorization', `Bearer ${token.value!.release()}`)
      .json(roleData)

    response.assertStatus(422)
  })

  test('should update role when authenticated with manage_roles permission', async ({
    client,
    assert,
  }) => {
    // Create test role with manage_roles permission
    const manageRolesPermission = await PermissionFactory.merge({ name: 'manage_roles' }).create()
    const testRole = await RoleFactory.merge({ name: 'test' }).create()
    await testRole.related('permissions').attach([manageRolesPermission.id])

    // Create test user
    const testUser = await UserFactory.merge({ roleId: testRole.id }).create()
    const token = await testUser.currentAccessToken.create(testUser)

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
    // Create test role with manage_roles permission
    const manageRolesPermission = await PermissionFactory.merge({ name: 'manage_roles' }).create()
    const testRole = await RoleFactory.merge({ name: 'test' }).create()
    await testRole.related('permissions').attach([manageRolesPermission.id])

    // Create test user
    const testUser = await UserFactory.merge({ roleId: testRole.id }).create()
    const token = await testUser.currentAccessToken.create(testUser)

    // Create target role
    const targetRole = await RoleFactory.create()

    const response = await client
      .delete(`/roles/${targetRole.id}`)
      .header('Authorization', `Bearer ${token.value!.release()}`)

    response.assertStatus(204)
  })

  test('should assign permissions to role', async ({ client, assert }) => {
    // Create test role with manage_roles permission
    const manageRolesPermission = await PermissionFactory.merge({ name: 'manage_roles' }).create()
    const testRole = await RoleFactory.merge({ name: 'test' }).create()
    await testRole.related('permissions').attach([manageRolesPermission.id])

    // Create test user
    const testUser = await UserFactory.merge({ roleId: testRole.id }).create()
    const token = await testUser.currentAccessToken.create(testUser)

    // Create target role and permissions
    const targetRole = await RoleFactory.create()
    const permissions = await PermissionFactory.createMany(3)

    const response = await client
      .put(`/roles/${targetRole.id}`)
      .header('Authorization', `Bearer ${token.value!.release()}`)
      .json({
        name: targetRole.name,
        description: targetRole.description,
        permissionIds: permissions.map((p) => p.id),
      })

    response.assertStatus(200)

    // Verify permissions were assigned
    await targetRole.load('permissions')
    assert.equal(targetRole.permissions.length, 3)
  })
})
