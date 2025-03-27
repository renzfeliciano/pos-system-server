import { Schema, ValidationError } from "joi"

export class JoiProvider {
    validate<T = Record<string, unknown>>(schema: Schema, data: T): T {
        const { error, value } = schema.validate(data, { abortEarly: false, stripUnknown: true })

        if (error) {
            const validationMessages = error.details.map((detail) => detail.message).join(", ")
            throw new ValidationError(`Validation failed: ${validationMessages}`, error.details, error)
        }

        return value
    }
}