import { test } from '@japa/runner'
import { PermissionFactory, RoleFactory, UserFactory } from '#database/factories/index'
import db from '@adonisjs/lucid/services/db'

test.group('Permissions CRUD', (group) => {
  group.each.setup(async () => {
    await db.beginGlobalTransaction()
  })

  group.each.teardown(async () => {
    await db.rollbackGlobalTransaction()
  })

  test('should get permissions list when authenticated with manage_permissions permission', async ({
    client,
    assert,
  }) => {
    // Create test role with manage_permissions permission
    const managePermissionsPermission = await PermissionFactory.merge({
      name: 'manage_permissions',
    }).create()
    const testRole = await RoleFactory.merge({ name: 'test' }).create()
    await testRole.related('permissions').attach([managePermissionsPermission.id])

    // Create test user
    const testUser = await UserFactory.merge({ roleId: testRole.id }).create()
    const token = await testUser.currentAccessToken.create(testUser)

    // Create test permissions
    await PermissionFactory.createMany(3)

    const response = await client
      .get('/api/permissions')
      .header('Authorization', `Bearer ${token.value!.release()}`)

    response.assertStatus(200)
    assert.isArray(response.body().data)
    assert.isAtLeast(response.body().data.length, 3)
  })

  test('should fail to get permissions without manage_permissions permission', async ({
    client,
  }) => {
    // Create user without manage_permissions permission
    const role = await RoleFactory.merge({ name: 'user_test' }).create()
    const user = await UserFactory.merge({ roleId: role.id }).create()
    const token = await user.currentAccessToken.create(user)

    const response = await client
      .get('/api/permissions')
      .header('Authorization', `Bearer ${token.value!.release()}`)

    response.assertStatus(403)
  })

  test('should create permission when authenticated with manage_permissions permission', async ({
    client,
    assert,
  }) => {
    // Create test role with manage_permissions permission
    const managePermissionsPermission = await PermissionFactory.merge({
      name: 'manage_permissions',
    }).create()
    const testRole = await RoleFactory.merge({ name: 'test' }).create()
    await testRole.related('permissions').attach([managePermissionsPermission.id])

    // Create test user
    const testUser = await UserFactory.merge({ roleId: testRole.id }).create()
    const token = await testUser.currentAccessToken.create(testUser)

    const permissionData = {
      name: 'new_permission',
      description: 'A new test permission',
    }

    const response = await client
      .post('/api/permissions')
      .header('Authorization', `Bearer ${token.value!.release()}`)
      .json(permissionData)

    response.assertStatus(201)
    assert.equal(response.body().name, permissionData.name)
    assert.equal(response.body().description, permissionData.description)
  })

  test('should fail to create permission with duplicate name', async ({ client }) => {
    // Create test role with manage_permissions permission
    const managePermissionsPermission = await PermissionFactory.merge({
      name: 'manage_permissions',
    }).create()
    const testRole = await RoleFactory.merge({ name: 'test' }).create()
    await testRole.related('permissions').attach([managePermissionsPermission.id])

    // Create test user
    const testUser = await UserFactory.merge({ roleId: testRole.id }).create()
    const token = await testUser.currentAccessToken.create(testUser)

    // Create existing permission
    const existingPermission = await PermissionFactory.create()

    const permissionData = {
      name: existingPermission.name, // Same name
      description: 'A duplicate permission',
    }

    const response = await client
      .post('/api/permissions')
      .header('Authorization', `Bearer ${token.value!.release()}`)
      .json(permissionData)

    response.assertStatus(422)
  })

  test('should update permission when authenticated with manage_permissions permission', async ({
    client,
    assert,
  }) => {
    // Create test role with manage_permissions permission
    const managePermissionsPermission = await PermissionFactory.merge({
      name: 'manage_permissions',
    }).create()
    const testRole = await RoleFactory.merge({ name: 'test' }).create()
    await testRole.related('permissions').attach([managePermissionsPermission.id])

    // Create test user
    const testUser = await UserFactory.merge({ roleId: testRole.id }).create()
    const token = await testUser.currentAccessToken.create(testUser)

    // Create target permission
    const targetPermission = await PermissionFactory.create()

    const updateData = {
      name: 'updated_permission',
      description: 'Updated description',
    }

    const response = await client
      .put(`/permissions/${targetPermission.id}`)
      .header('Authorization', `Bearer ${token.value!.release()}`)
      .json(updateData)

    response.assertStatus(200)
    assert.equal(response.body().name, updateData.name)
    assert.equal(response.body().description, updateData.description)
  })

  test('should delete permission when authenticated with manage_permissions permission', async ({
    client,
  }) => {
    // Create test role with manage_permissions permission
    const managePermissionsPermission = await PermissionFactory.merge({
      name: 'manage_permissions',
    }).create()
    const testRole = await RoleFactory.merge({ name: 'test' }).create()
    await testRole.related('permissions').attach([managePermissionsPermission.id])

    // Create test user
    const testUser = await UserFactory.merge({ roleId: testRole.id }).create()
    const token = await testUser.currentAccessToken.create(testUser)

    // Create target permission
    const targetPermission = await PermissionFactory.create()

    const response = await client
      .delete(`/permissions/${targetPermission.id}`)
      .header('Authorization', `Bearer ${token.value!.release()}`)

    response.assertStatus(204)
  })

  test('should get specific permission when authenticated with manage_permissions permission', async ({
    client,
    assert,
  }) => {
    // Create test role with manage_permissions permission
    const managePermissionsPermission = await PermissionFactory.merge({
      name: 'manage_permissions',
    }).create()
    const testRole = await RoleFactory.merge({ name: 'test' }).create()
    await testRole.related('permissions').attach([managePermissionsPermission.id])

    // Create test user
    const testUser = await UserFactory.merge({ roleId: testRole.id }).create()
    const token = await testUser.currentAccessToken.create(testUser)

    // Create target permission
    const targetPermission = await PermissionFactory.create()

    const response = await client
      .get(`/permissions/${targetPermission.id}`)
      .header('Authorization', `Bearer ${token.value!.release()}`)

    response.assertStatus(200)
    assert.equal(response.body().id, targetPermission.id)
    assert.equal(response.body().name, targetPermission.name)
  })

  test('should return 404 for non-existent permission', async ({ client }) => {
    // Create test role with manage_permissions permission
    const managePermissionsPermission = await PermissionFactory.merge({
      name: 'manage_permissions',
    }).create()
    const testRole = await RoleFactory.merge({ name: 'test' }).create()
    await testRole.related('permissions').attach([managePermissionsPermission.id])

    // Create test user
    const testUser = await UserFactory.merge({ roleId: testRole.id }).create()
    const token = await testUser.currentAccessToken.create(testUser)

    const response = await client
      .get('/permissions/99999')
      .header('Authorization', `Bearer ${token.value!.release()}`)

    response.assertStatus(404)
  })
})
