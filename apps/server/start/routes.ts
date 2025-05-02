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

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

/**
 * Маршруты аутентификации
 */
router
  .group(() => {
    // Регистрация, вход (не требуют аутентификации)
    router.post('/register', '#controllers/auth_controller.register')
    router.post('/login', '#controllers/auth_controller.login')
    
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

/**
 * Маршруты для администрирования ролей и прав (только для админа)
 */
router
  .group(() => {
    // API управления ролями и правами доступа
    router.get('/roles', async ({ response }) => {
      const roles = await import('#models/role').then(m => m.default.query().preload('permissions'))
      return { roles }
    })
    
    router.get('/permissions', async ({ response }) => {
      const permissions = await import('#models/permission').then(m => m.default.all())
      return { permissions }
    })
  })
  .prefix('/api/admin')
  .middleware(middleware.auth({ guards: ['api'] }))
  .middleware(middleware.role({ roles: ['admin'] }))
