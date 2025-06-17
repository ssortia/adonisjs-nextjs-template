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
import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'

/**
 * Маршруты аутентификации
 */
router
  .group(() => {
    // Регистрация, вход (не требуют аутентификации)
    router.post('/register', '#controllers/auth_controller.register')
    router.post('/login', '#controllers/auth_controller.login')

    // Подтверждение email (не требует аутентификации)
    router.get('/verify-email/:token', '#controllers/email_verifications_controller.verify')
    router.post('/resend-verification', '#controllers/email_verifications_controller.resend')

    // Защищенные маршруты (требуют аутентификации)
    router
      .group(() => {
        router.post('/logout', '#controllers/auth_controller.logout')
        router.get('/me', '#controllers/auth_controller.me')
        router.get('/permissions', '#controllers/auth_controller.permissions')
      })
      .middleware(middleware.auth({ guards: ['api'] }))
  })
  .prefix('/api/auth')

router.resource('users', '#controllers/users_controller').use('*', middleware.resource())
router.resource('permissions', '#controllers/permissions_controller').use('*', middleware.resource())
router.resource('roles', '#controllers/roles_controller').use('*', middleware.resource())

/**
 * System information route (admin only)
 */
router
  .group(() => {
    router.get('/info', '#controllers/system_controller.info')
  })
  .prefix('/api/system')
  .middleware([
    middleware.auth({ guards: ['api'] }),
    middleware.permission({ permissions: ['admin.access'] })
  ])

// Swagger Documentation
router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

// Swagger UI
router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
})
