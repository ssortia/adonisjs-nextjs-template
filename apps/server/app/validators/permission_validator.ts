import vine from '@vinejs/vine'

/**
 * Validator for permission creation and update
 */
export const permissionValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    description: vine.string().trim().nullable(),
  })
)