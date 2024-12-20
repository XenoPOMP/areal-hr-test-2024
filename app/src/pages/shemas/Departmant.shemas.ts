import Joi from 'joi';

export { departmentSchema };

const departmentSchema = Joi.object({
  name: Joi.string().min(3).max(255).required().messages({
    'string.min': 'Название департамента должно содержать хотя бы 3 символа',
    'string.max': 'Название департамента не должно превышать 255 символов',
    'string.empty': 'Название департамента обязательно',
  }),
  comment: Joi.string().max(500).optional().messages({
    'string.max': 'Комментарий не должен превышать 500 символов',
  }),
  parent_id: Joi.number().allow(null).optional(),
  organisation_id: Joi.number().allow(null).optional(),
  id: Joi.forbidden(),
  deleted_at: Joi.forbidden(),
});
