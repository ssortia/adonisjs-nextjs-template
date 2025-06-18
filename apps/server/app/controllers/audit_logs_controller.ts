import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import AuditLogService from '#services/audit_log_service'

@inject()
export default class AuditLogsController {
  constructor(private auditLogService: AuditLogService) {}

  async index({ request, response }: HttpContext) {
    try {
      const filters: any = {}
      if (request.input('type')) filters.type = request.input('type')
      if (request.input('action')) filters.action = request.input('action')
      if (request.input('userId')) filters.userId = request.input('userId')
      if (request.input('search')) filters.search = request.input('search')
      if (request.input('dateFrom')) filters.dateFrom = request.input('dateFrom')
      if (request.input('dateTo')) filters.dateTo = request.input('dateTo')

      const sort = {
        sortBy: request.input('sortBy', 'createdAt'),
        sortOrder: request.input('sortOrder', 'desc')
      }

      const pagination = {
        page: request.input('page', 1),
        limit: request.input('limit', 20)
      }
      const result = await this.auditLogService.getAuditLogs(filters, sort, pagination)

      return response.json(result)
    } catch (error) {
      console.error('Audit logs fetch error:', error)
      return response.internalServerError({
        message: 'Failed to fetch audit logs',
        error: error.message
      })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const auditLog = await this.auditLogService.getAuditLogById(params.id)
      return response.ok(auditLog)
    } catch (error) {
      return response.notFound({
        message: 'Audit log not found'
      })
    }
  }

  async stats({ request, response }: HttpContext) {
    try {
      const period = request.input('period', 'day')
      const stats = await this.auditLogService.getStats(period)
      return response.ok(stats)
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to fetch audit logs stats',
        error: error.message
      })
    }
  }

  async actions({ response }: HttpContext) {
    try {
      const actions = await this.auditLogService.getAvailableActions()
      return response.ok({ actions })
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to fetch actions',
        error: error.message
      })
    }
  }
}