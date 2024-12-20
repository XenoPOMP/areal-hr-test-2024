import Joi from 'joi';

export { organizationSchema };

const organizationSchema = Joi.object({
  name: Joi.string().min(3).max(255).required().messages({
    'string.min': 'Название организации должно содержать хотя бы 3 символа',
    'string.max': 'Название организации не должно превышать 255 символов',
    'string.empty': 'Название организации обязательно',
  }),
  comment: Joi.string().max(500).optional().messages({
    'string.max': 'Комментарий не должен превышать 500 символов',
  }),
  id: Joi.forbidden(),
  deleted_at: Joi.forbidden(),
});
