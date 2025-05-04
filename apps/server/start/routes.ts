/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import AuthController from '#controllers/auth_controller'
import PermissionController from '#controllers/permission_controller'

const authRoutes = () => {
  // Регистрация, вход (не требуют аутентификации)
  router.post('/register', [AuthController, 'register'])
  router.post('/login', [AuthController, 'login'])

  // Защищенные маршруты (требуют аутентификации)
  router
  .group(() => {
    router.post('/logout', [AuthController, 'logout'])
    router.get('/me', [AuthController, 'me'])
    router.get('/permissions', [AuthController, 'permissions'])
  })
    .middleware(middleware.auth({ guards: ['api'] }))
}

const permissionRoutes = () => {
  router.get('/', [PermissionController, 'index']).middleware(middleware.permission({ permissions: ['roles.view'] }))
  router.get('/:id', [PermissionController, 'show']).middleware(middleware.permission({ permissions: ['roles.view'] }))
  router.post('/', [PermissionController, 'store']).middleware(middleware.permission({ permissions: ['roles.create'] }))
  router.put('/:id', [PermissionController, 'update']).middleware(middleware.permission({ permissions: ['roles.edit'] }))
  router.delete('/:id', [PermissionController, 'destroy']).middleware(middleware.permission({ permissions: ['roles.delete'] }))
}

/**
 * Маршруты аутентификации
 */
router.group(authRoutes).prefix('/api/auth')

/**
 * Маршруты для администрирования ролей и прав (только для админа)
 */
router
  .group(permissionRoutes)
  .prefix('/api/admin/permissions')
  .middleware(middleware.auth({ guards: ['api'] }));
