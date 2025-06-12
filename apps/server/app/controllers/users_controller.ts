import ResourceController from '#controllers/resource_controller'
import User from '#models/user'

export default class UsersController extends ResourceController<typeof User> {
  protected model = User

  protected applySearch(query: any, search: string) {
    return query.where((builder: any) => {
      builder
        .whereILike('full_name', `%${search}%`)
        .orWhereILike('email', `%${search}%`)
        .orWhereHas('role', (roleBuilder: any) => {
          roleBuilder.whereILike('name', `%${search}%`)
        })
    }).preload('role')
  }
}
