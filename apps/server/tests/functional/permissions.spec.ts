import { test } from '@japa/runner'
import { RoleFactory, UserFactory } from '#database/factories/index'
import db from '@adonisjs/lucid/services/db'
import { createAuthToken } from '#tests/helpers/auth_helper'
import Permission from '#models/permission'

test.group('Permissions CRUD', (group) => {
  group.each.setup(async () => {
    await db.beginGlobalTransaction()
  })

  group.each.teardown(async () => {
    await db.rollbackGlobalTransaction()
  })

  test('should get permissions list when authenticated with permissions.view permission', async ({
    client,
    assert,
  }) => {
    // Get existing permissions.view permission from seeder
    const viewPermission = await Permission.findByOrFail('name', 'permissions.view')
    const testRole = await RoleFactory.merge({ name: 'test' }).create()
    await testRole.related('permissions').attach([viewPermission.id])

    // Create test user
    const testUser = await UserFactory.merge({ roleId: testRole.id }).create()
    const token = await createAuthToken(testUser)

    const response = await client.get('/api/permissions').header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.isArray(response.body().data)
    assert.isAtLeast(response.body().data.length, 3)
  })

  test('should fail to get permissions without permissions.view permission', async ({ client }) => {
    // Create user without permissions.view permission
    const role = await RoleFactory.merge({ name: 'user_test' }).create()
    const user = await UserFactory.merge({ roleId: role.id }).create()
    const token = await createAuthToken(user)

    const response = await client.get('/api/permissions').header('Authorization', `Bearer ${token}`)

    response.assertStatus(403)
  })

  test('should create permission when authenticated with permissions.create permission', async ({
    client,
    assert,
  }) => {
    // Get existing permissions.create permission from seeder
    const createPermission = await Permission.findByOrFail('name', 'permissions.create')
    const testRole = await RoleFactory.merge({ name: 'test' }).create()
    await testRole.related('permissions').attach([createPermission.id])

    // Create test user
    const testUser = await UserFactory.merge({ roleId: testRole.id }).create()
    const token = await createAuthToken(testUser)

    const permissionData = {
      name: 'new_permission',
      description: 'A new test permission',
    }

    const response = await client
      .post('/api/permissions')
      .header('Authorization', `Bearer ${token}`)
      .json(permissionData)

    response.assertStatus(201)
    assert.equal(response.body().name, permissionData.name)
    assert.equal(response.body().description, permissionData.description)
  })

  test('should fail to create permission with duplicate name', async ({ client }) => {
    // Get existing permissions.create permission from seeder
    const createPermission = await Permission.findByOrFail('name', 'permissions.create')
    const testRole = await RoleFactory.merge({ name: 'test' }).create()
    await testRole.related('permissions').attach([createPermission.id])

    // Create test user
    const testUser = await UserFactory.merge({ roleId: testRole.id }).create()
    const token = await createAuthToken(testUser)

    // Use existing permission name from seeder
    const existingPermission = await Permission.findByOrFail('name', 'users.view')

    const permissionData = {
      name: existingPermission.name, // Same name
      description: 'A duplicate permission',
    }

    const response = await client
      .post('/api/permissions')
      .header('Authorization', `Bearer ${token}`)
      .json(permissionData)

    response.assertStatus(422)
  })

  test('should update permission when authenticated with permissions.edit permission', async ({
    client,
    assert,
  }) => {
    // Get existing permissions.edit permission from seeder
    const editPermission = await Permission.findByOrFail('name', 'permissions.edit')
    const testRole = await RoleFactory.merge({ name: 'test' }).create()
    await testRole.related('permissions').attach([editPermission.id])

    // Create test user
    const testUser = await UserFactory.merge({ roleId: testRole.id }).create()
    const token = await createAuthToken(testUser)

    // Get target permission to update
    const targetPermission = await Permission.findByOrFail('name', 'users.view')

    const updateData = {
      name: 'updated_permission',
      description: 'Updated description',
    }

    const response = await client
      .put(`/api/permissions/${targetPermission.id}`)
      .header('Authorization', `Bearer ${token}`)
      .json(updateData)

    response.assertStatus(200)
    assert.equal(response.body().name, updateData.name)
    assert.equal(response.body().description, updateData.description)
  })

  test('should delete permission when authenticated with permissions.delete permission', async ({
    client,
  }) => {
    // Get existing permissions.delete permission from seeder
    const deletePermission = await Permission.findByOrFail('name', 'permissions.delete')
    const testRole = await RoleFactory.merge({ name: 'test' }).create()
    await testRole.related('permissions').attach([deletePermission.id])

    // Create test user
    const testUser = await UserFactory.merge({ roleId: testRole.id }).create()
    const token = await createAuthToken(testUser)

    // Get target permission to delete
    const targetPermission = await Permission.findByOrFail('name', 'users.create')

    const response = await client
      .delete(`/api/permissions/${targetPermission.id}`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(204)
  })

  test('should get specific permission when authenticated with permissions.view permission', async ({
    client,
    assert,
  }) => {
    // Get existing permissions.view permission from seeder
    const viewPermission = await Permission.findByOrFail('name', 'permissions.view')
    const testRole = await RoleFactory.merge({ name: 'test' }).create()
    await testRole.related('permissions').attach([viewPermission.id])

    // Create test user
    const testUser = await UserFactory.merge({ roleId: testRole.id }).create()
    const token = await createAuthToken(testUser)

    // Get target permission to view
    const targetPermission = await Permission.findByOrFail('name', 'users.edit')

    const response = await client
      .get(`/api/permissions/${targetPermission.id}`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.equal(response.body().id, targetPermission.id)
    assert.equal(response.body().name, targetPermission.name)
  })

  test('should return 404 for non-existent permission', async ({ client }) => {
    // Get existing permissions.view permission from seeder
    const viewPermission = await Permission.findByOrFail('name', 'permissions.view')
    const testRole = await RoleFactory.merge({ name: 'test' }).create()
    await testRole.related('permissions').attach([viewPermission.id])

    // Create test user
    const testUser = await UserFactory.merge({ roleId: testRole.id }).create()
    const token = await createAuthToken(testUser)

    const response = await client
      .get('/api/permissions/99999')
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(404)
  })
})
