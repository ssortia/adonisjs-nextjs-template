import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'
import { Exception } from '@adonisjs/core/exceptions'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    const { response } = ctx

    if (error instanceof errors.E_VALIDATION_ERROR) {
      return response.status(422).send({
        message: 'Validation failed',
        code: 'E_VALIDATION_ERROR',
        status: 422,
        errors: error.messages,
      })
    }

    if (error instanceof Exception) {
      return response.status(error.status).send({
        message: error.message,
        code: error.code,
        status: error.status,
      })
    }

    if (error instanceof Error) {
      if (error.message === 'E_ROW_NOT_FOUND') {
        return response.status(404).send({
          message: 'Resource not found',
          code: 'E_ROW_NOT_FOUND',
          status: 404,
        })
      }
    }

    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
