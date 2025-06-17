import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import SystemInfoService from '#services/system_info_service'

@inject()
export default class SystemController {
  constructor(private systemInfoService: SystemInfoService) {}

  async info({ response }: HttpContext) {
    try {
      const systemInfo = this.systemInfoService.getSystemInfo()
      return response.ok(systemInfo)
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to retrieve system information',
        error: error.message
      })
    }
  }
}