import Joi from 'joi';

export const userSchema = Joi.object({
  name: Joi.string().min(1).max(100).required().messages({
    'string.base': 'Имя должно быть строкой',
    'string.min': 'Имя должно содержать хотя бы 1 символ',
    'string.max': 'Имя не может содержать более 100 символов',
    'any.required': 'Имя обязательно',
  }),

  surname: Joi.string().min(1).max(100).required().messages({
    'string.base': 'Фамилия должна быть строкой',
    'string.min': 'Фамилия должна содержать хотя бы 1 символ',
    'string.max': 'Фамилия не может содержать более 100 символов',
    'any.required': 'Фамилия обязательна',
  }),

  login: Joi.string().alphanum().min(3).max(30).required().messages({
    'string.base': 'Логин должен быть строкой',
    'string.alphanum': 'Логин может содержать только буквы и цифры',
    'string.min': 'Логин должен содержать хотя бы 3 символа',
    'string.max': 'Логин не может содержать более 30 символов',
    'any.required': 'Логин обязателен',
  }),

  password: Joi.string().min(8).max(128).required().messages({
    'string.base': 'Пароль должен быть строкой',
    'string.min': 'Пароль должен содержать хотя бы 8 символов',
    'string.max': 'Пароль не может содержать более 128 символов',
    'any.required': 'Пароль обязателен',
  }),

  id: Joi.number().integer().optional(),
  second_name: Joi.string().optional(),
  deleted_at: Joi.forbidden(),
});
