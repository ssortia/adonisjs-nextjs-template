import ResourceController from '#controllers/resource_controller'
import User from '#models/user'

export default class UsersController extends ResourceController<typeof User> {
  protected model = User
}
