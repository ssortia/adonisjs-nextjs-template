import { HttpContext } from '@adonisjs/core/http'
import Permission from '#models/permission'
import { permissionValidator } from '#validators/permission_validator'

export default class PermissionController {
  /**
   * Get all permissions
   */
  async index({ response }: HttpContext) {
    const permissions = await Permission.all()

    return response.ok({ permissions })
  }

  /**
   * Get a specific permission
   */
  async show({ params, response }: HttpContext) {
    const permission = await Permission.find(params.id)
    
    if (!permission) {
      return response.notFound({ message: 'Разрешение не найдено' })
    }

    return response.ok({ permission })
  }

  /**
   * Create a new permission
   */
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(permissionValidator)
    
    // Check if permission with the same name already exists
    const existingPermission = await Permission.findBy('name', data.name)

    if (existingPermission) {
      return response.conflict({
        message: 'Разрешение с таким именем уже существует',
      })
    }

    const permission = await Permission.create(data)
    
    return response.created({ permission })
  }

  /**
   * Update a permission
   */
  async update({ params, request, response }: HttpContext) {
    const permission = await Permission.find(params.id)
    
    if (!permission) {
      return response.notFound({ message: 'Разрешение не найдено' })
    }
    
    const data = await request.validateUsing(permissionValidator)
    
    // Check if permission with the same name already exists (excluding current)
    const existingPermission = await Permission.query()
      .where('name', data.name)
      .whereNot('id', params.id)
      .first()
      
    if (existingPermission) {
      return response.conflict({
        message: 'Разрешение с таким именем уже существует',
      })
    }
    
    permission.merge(data)
    await permission.save()
    
    return response.ok({ permission })
  }

  /**
   * Delete a permission
   */
  async destroy({ params, response }: HttpContext) {
    const permission = await Permission.find(params.id)
    
    if (!permission) {
      return response.notFound({ message: 'Разрешение не найдено' })
    }
    
    // Detach permission from all roles before deleting
    await permission.related('roles').detach()
    await permission.delete()
    
    return response.noContent()
  }
}