import ResourceController from '#controllers/resource_controller'
import Role from '#models/role'
import type { HttpContext } from '@adonisjs/core/http'

export default class RolesController extends ResourceController<typeof Role> {
  protected model = Role

  protected applyPreloads(query: any) {
    return query.preload('permissions')
  }

  protected applySearch(query: any, search: string) {
    return query.where((builder: any) => {
      builder
        .whereILike('name', `%${search}%`)
        .orWhereILike('description', `%${search}%`)
    })
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

}
