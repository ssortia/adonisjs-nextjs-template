import ResourceController from '#controllers/resource_controller'
import Role from '#models/role'
import type { HttpContext } from '@adonisjs/core/http'

export default class RolesController extends ResourceController<typeof Role> {
  protected model = Role

  protected applySearch(query: any, search: string) {
    return query.where((builder: any) => {
      builder
        .whereILike('name', `%${search}%`)
        .orWhereILike('description', `%${search}%`)
    }).preload('permissions')
  }

  async index({ request, response }: HttpContext) {
    try {
      const page = Math.max(1, Number(request.input('page', 1)))
      const limit = Math.min(100, Math.max(1, Number(request.input('limit', 10))))
      const search = request.input('search', '').trim()

      let query = this.model.query().preload('permissions')

      if (search) {
        query = this.applySearch(query, search)
      }

      query = this.applyFilters(query, request)
      query = this.applySorting(query, request)

      const records = await query.paginate(page, limit)
      
      return response.ok(records)
    } catch (error) {
      return response.badRequest({ message: 'Failed to fetch records', error: error.message })
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const data = await this.validateStoreData(request)
      const { permissions, ...roleData } = data
      
      const role = await this.model.create(roleData)
      
      if (permissions && Array.isArray(permissions)) {
        await role.related('permissions').sync(permissions)
      }

      await role.load('permissions')
      
      return response.created(role)
    } catch (error) {
      return response.badRequest({ message: 'Failed to create record', error: error.message })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const role = await this.findRecord(params.id)
      const data = await this.validateUpdateData(request)
      const { permissions, ...roleData } = data
      
      role.merge(roleData)
      await role.save()

      if (permissions !== undefined && Array.isArray(permissions)) {
        await role.related('permissions').sync(permissions)
      }

      await role.load('permissions')
      
      return response.ok(role)
    } catch (error) {
      if (error.message.includes('not found')) {
        return response.notFound({ message: 'Record not found', error: error.message })
      }
      return response.badRequest({ message: 'Failed to update record', error: error.message })
    }
  }

  protected async findRecord(id: string | number) {
    return await this.model.query().where('id', id).preload('permissions').firstOrFail()
  }
}
