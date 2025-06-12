import ResourceController from '#controllers/resource_controller'
import Role from '#models/role'

export default class RolesController extends ResourceController<typeof Role> {
  protected model = Role
}
