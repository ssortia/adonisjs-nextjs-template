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
      })
      .middleware(middleware.auth({ guards: ['api'] }))
  })
  .prefix('/api/auth')
