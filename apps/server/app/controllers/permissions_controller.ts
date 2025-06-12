import ResourceController from '#controllers/resource_controller'
import Permission from '#models/permission'

export default class PermissionsController extends ResourceController<typeof Permission> {
  protected model = Permission

  protected applySearch(query: any, search: string) {
    return query.where((builder: any) => {
      builder
        .whereILike('name', `%${search}%`)
        .orWhereILike('description', `%${search}%`)
    })
  }
}
