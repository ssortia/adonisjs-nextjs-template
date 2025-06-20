import { test } from '@japa/runner'
import { UserFactory, RoleFactory, PermissionFactory } from '#database/factories/index'
import db from '@adonisjs/lucid/services/db'

test.group('Users CRUD', (group) => {
  group.each.setup(async () => {
    await db.beginGlobalTransaction()
  })

  group.each.teardown(async () => {
    await db.rollbackGlobalTransaction()
  })

  test('should get users list when authenticated with read permission', async ({
    client,
    assert,
  }) => {
    // Create testuser role with read permission
    const readPermission = await PermissionFactory.merge({ name: 'read_user' }).create()
    const testuserRole = await RoleFactory.merge({ name: 'testuser' }).create()
    await testuserRole.related('permissions').attach([readPermission.id])

    // Create testuser user
    const testuserUser = await UserFactory.merge({ roleId: testuserRole.id }).create()
    const token = await testuserUser.currentAccessToken.create(testuserUser)

    // Create some test users
    await UserFactory.createMany(3)

    const response = await client
      .get('/api/users')
      .header('Authorization', `Bearer ${token.value!.release()}`)

    response.assertStatus(200)
    assert.isArray(response.body().data)
    assert.isAtLeast(response.body().data.length, 3)
  })

  test('should fail to get users without authentication', async ({ client }) => {
    const response = await client.get('/api/users')

    response.assertStatus(401)
  })

  test('should fail to get users without read permission', async ({ client }) => {
    // Create user without read permission
    const role = await RoleFactory.merge({ name: 'testuser' }).create()
    const user = await UserFactory.merge({ roleId: role.id }).create()
    const token = await user.currentAccessToken.create(user)

    const response = await client
      .get('/api/users')
      .header('Authorization', `Bearer ${token.value!.release()}`)

    response.assertStatus(403)
  })

  test('should get specific user when authenticated with read permission', async ({
    client,
    assert,
  }) => {
    // Create testuser role with read permission
    const readPermission = await PermissionFactory.merge({ name: 'read_user' }).create()
    const testuserRole = await RoleFactory.merge({ name: 'testuser' }).create()
    await testuserRole.related('permissions').attach([readPermission.id])

    // Create testuser user
    const testuserUser = await UserFactory.merge({ roleId: testuserRole.id }).create()
    const token = await testuserUser.currentAccessToken.create(testuserUser)

    // Create target user
    const targetUser = await UserFactory.create()

    const response = await client
      .get(`/users/${targetUser.id}`)
      .header('Authorization', `Bearer ${token.value!.release()}`)

    response.assertStatus(200)
    assert.equal(response.body().id, targetUser.id)
    assert.equal(response.body().email, targetUser.email)
  })

  test('should create user when authenticated with create permission', async ({
    client,
    assert,
  }) => {
    // Create testuser role with create permission
    const createPermission = await PermissionFactory.merge({ name: 'create_user' }).create()
    const testuserRole = await RoleFactory.merge({ name: 'testuser' }).create()
    await testuserRole.related('permissions').attach([createPermission.id])

    // Create testuser user
    const testuserUser = await UserFactory.merge({ roleId: testuserRole.id }).create()
    const token = await testuserUser.currentAccessToken.create(testuserUser)

    const userData = {
      fullName: 'New User',
      email: 'newuser@example.com',
      password: 'password123',
      passwordConfirmation: 'password123',
    }

    const response = await client
      .post('/api/users')
      .header('Authorization', `Bearer ${token.value!.release()}`)
      .json(userData)

    response.assertStatus(201)
    assert.equal(response.body().email, userData.email)
    assert.equal(response.body().fullName, userData.fullName)
  })

  test('should fail to create user without create permission', async ({ client }) => {
    // Create user without create permission
    const role = await RoleFactory.merge({ name: 'testuser' }).create()
    const user = await UserFactory.merge({ roleId: role.id }).create()
    const token = await user.currentAccessToken.create(user)

    const userData = {
      fullName: 'New User',
      email: 'newuser@example.com',
      password: 'password123',
      passwordConfirmation: 'password123',
    }

    const response = await client
      .post('/api/users')
      .header('Authorization', `Bearer ${token.value!.release()}`)
      .json(userData)

    response.assertStatus(403)
  })

  test('should fail to create user with duplicate email', async ({ client }) => {
    // Create testuser role with create permission
    const createPermission = await PermissionFactory.merge({ name: 'create_user' }).create()
    const testuserRole = await RoleFactory.merge({ name: 'testuser' }).create()
    await testuserRole.related('permissions').attach([createPermission.id])

    // Create testuser user
    const testuserUser = await UserFactory.merge({ roleId: testuserRole.id }).create()
    const token = await testuserUser.currentAccessToken.create(testuserUser)

    // Create existing user
    const existingUser = await UserFactory.create()

    const userData = {
      fullName: 'New User',
      email: existingUser.email, // Same email
      password: 'password123',
      passwordConfirmation: 'password123',
    }

    const response = await client
      .post('/api/users')
      .header('Authorization', `Bearer ${token.value!.release()}`)
      .json(userData)

    response.assertStatus(422)
  })

  test('should update user when authenticated with update permission', async ({
    client,
    assert,
  }) => {
    // Create testuser role with update permission
    const updatePermission = await PermissionFactory.merge({ name: 'update_user' }).create()
    const testuserRole = await RoleFactory.merge({ name: 'testuser' }).create()
    await testuserRole.related('permissions').attach([updatePermission.id])

    // Create testuser user
    const testuserUser = await UserFactory.merge({ roleId: testuserRole.id }).create()
    const token = await testuserUser.currentAccessToken.create(testuserUser)

    // Create target user
    const targetUser = await UserFactory.create()

    const updateData = {
      fullName: 'Updated Name',
      email: 'updated@example.com',
    }

    const response = await client
      .put(`/users/${targetUser.id}`)
      .header('Authorization', `Bearer ${token.value!.release()}`)
      .json(updateData)

    response.assertStatus(200)
    assert.equal(response.body().fullName, updateData.fullName)
    assert.equal(response.body().email, updateData.email)
  })

  test('should delete user when authenticated with delete permission', async ({ client }) => {
    // Create testuser role with delete permission
    const deletePermission = await PermissionFactory.merge({ name: 'delete_user' }).create()
    const testuserRole = await RoleFactory.merge({ name: 'testuser' }).create()
    await testuserRole.related('permissions').attach([deletePermission.id])

    // Create testuser user
    const testuserUser = await UserFactory.merge({ roleId: testuserRole.id }).create()
    const token = await testuserUser.currentAccessToken.create(testuserUser)

    // Create target user
    const targetUser = await UserFactory.create()

    const response = await client
      .delete(`/users/${targetUser.id}`)
      .header('Authorization', `Bearer ${token.value!.release()}`)

    response.assertStatus(204)
  })

  test('should fail to delete user without delete permission', async ({ client }) => {
    // Create user without delete permission
    const role = await RoleFactory.merge({ name: 'testuser' }).create()
    const user = await UserFactory.merge({ roleId: role.id }).create()
    const token = await user.currentAccessToken.create(user)

    // Create target user
    const targetUser = await UserFactory.create()

    const response = await client
      .delete(`/users/${targetUser.id}`)
      .header('Authorization', `Bearer ${token.value!.release()}`)

    response.assertStatus(403)
  })

  test('should return 404 for non-existent user', async ({ client }) => {
    // Create testuser role with read permission
    const readPermission = await PermissionFactory.merge({ name: 'read_user' }).create()
    const testuserRole = await RoleFactory.merge({ name: 'testuser' }).create()
    await testuserRole.related('permissions').attach([readPermission.id])

    // Create testuser user
    const testuserUser = await UserFactory.merge({ roleId: testuserRole.id }).create()
    const token = await testuserUser.currentAccessToken.create(testuserUser)

    const response = await client
      .get('/users/99999')
      .header('Authorization', `Bearer ${token.value!.release()}`)

    response.assertStatus(404)
  })
})
