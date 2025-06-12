import ResourceController from '#controllers/resource_controller'
import Permission from '#models/permission'

export default class PermissionsController extends ResourceController<typeof Permission> {
  protected model = Permission
}
