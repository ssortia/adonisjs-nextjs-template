import type { HttpContext } from '@adonisjs/core/http'
import type { BaseModel } from '@adonisjs/lucid/orm'

export default abstract class ResourceController<Model extends typeof BaseModel> {
  protected abstract model: Model

  /**
   * Display a listing of the resource.
   * GET /resource
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = Math.max(1, Number(request.input('page', 1)))
      const limit = Math.min(100, Math.max(1, Number(request.input('limit', 10))))
      const search = request.input('search', '').trim()

      let query = this.model.query()

      // Apply preloads before any other operations
      query = this.applyPreloads(query)

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

  /**
   * Store a newly created resource in storage.
   * POST /resource
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await this.validateStoreData(request)
      
      const record = await this.model.create(data)
      
      return response.created(record)
    } catch (error) {
      return response.badRequest({ message: 'Failed to create record', error: error.message })
    }
  }

  /**
   * Display the specified resource.
   * GET /resource/:id
   */
  async show({ params, response }: HttpContext) {
    try {
      const record = await this.findRecord(params.id)
      
      return response.ok(record)
    } catch (error) {
      return response.notFound({ message: 'Record not found', error: error.message })
    }
  }

  /**
   * Update the specified resource in storage.
   * PUT/PATCH /resource/:id
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const record = await this.findRecord(params.id)
      const data = await this.validateUpdateData(request)
      
      record.merge(data)
      await record.save()
      
      return response.ok(record)
    } catch (error) {
      if (error.message.includes('not found')) {
        return response.notFound({ message: 'Record not found', error: error.message })
      }
      return response.badRequest({ message: 'Failed to update record', error: error.message })
    }
  }

  /**
   * Remove the specified resource from storage.
   * DELETE /resource/:id
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const record = await this.findRecord(params.id)
      
      await record.delete()
      
      return response.noContent()
    } catch (error) {
      if (error.message.includes('not found')) {
        return response.notFound({ message: 'Record not found', error: error.message })
      }
      return response.badRequest({ message: 'Failed to delete record', error: error.message })
    }
  }

  /**
   * Find a single record by ID
   */
  protected async findRecord(id: string | number) {
    let query = this.model.query().where('id', id)
    query = this.applyPreloads(query)
    return await query.firstOrFail()
  }

  /**
   * Apply preloads to query (override in child classes)
   */
  protected applyPreloads(query: any) {
    return query
  }

  /**
   * Apply search filters to query (override in child classes)
   */
  protected applySearch(query: any, _search: string) {
    return query
  }

  /**
   * Apply additional filters to query (override in child classes)
   */
  protected applyFilters(query: any, _request: any) {
    return query
  }

  /**
   * Apply sorting to query (override in child classes)
   */
  protected applySorting(query: any, request: any) {
    const sortBy = request.input('sortBy', 'id')
    const sortOrder = request.input('sortOrder', 'desc')
    
    return query.orderBy(sortBy, sortOrder)
  }

  /**
   * Validate data for store operation (override in child classes)
   */
  protected async validateStoreData(request: any) {
    return request.all()
  }

  /**
   * Validate data for update operation (override in child classes)
   */
  protected async validateUpdateData(request: any) {
    return request.all()
  }
}
