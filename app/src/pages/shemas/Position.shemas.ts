import Joi from 'joi';

export { positionSchema };

const positionSchema = Joi.object({
  name: Joi.string().min(2).max(255).required().messages({
    'string.min': 'Название должности должно содержать хотя бы 2 символа',
    'string.max': 'Название должности не должно превышать 255 символов',
    'string.empty': 'Название должности обязательно',
  }),
  id: Joi.forbidden(),
  deleted_at: Joi.forbidden(),
});
