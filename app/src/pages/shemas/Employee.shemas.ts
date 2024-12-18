import Joi from 'joi'; //todo to .shemas folder

export { passportSchema, addressSchema, employeeSchema };
// Схема для паспорта
const passportSchema = Joi.object({
  id: Joi.number().integer().optional(),
  serial: Joi.string().length(4).pattern(/^\d+$/).required().messages({
    'string.empty': 'Серия паспорта обязательна',
    'string.length': 'Серия паспорта должна состоять из 4 цифр',
    'string.pattern.base': 'Серия паспорта должна содержать только цифры',
  }),
  number: Joi.string().length(6).pattern(/^\d+$/).required().messages({
    'string.empty': 'Номер паспорта обязателен',
    'string.length': 'Номер паспорта должен состоять из 6 цифр',
    'string.pattern.base': 'Номер паспорта должен содержать только цифры',
  }),
  date_issue: Joi.date().iso().required().messages({
    'date.base': 'Дата выдачи паспорта некорректна',
    'any.required': 'Дата выдачи паспорта обязательна',
  }),
  issued_by: Joi.string().max(255).required().messages({
    'string.empty': 'Кем выдан паспорт обязательно',
    'string.max': 'Поле "Кем выдан" не должно превышать 255 символов',
  }),
  code: Joi.string()
    .pattern(/^\d{3}-\d{3}$/)
    .required()
    .messages({
      'string.empty': 'Код подразделения обязателен',
      'string.pattern.base': 'Код подразделения должен быть в формате 123-456',
    }),
  deleted_at: Joi.date().optional().allow(null),
}).unknown(true);

// Схема для адреса
const addressSchema = Joi.object({
  id: Joi.number().integer().optional(),
  region: Joi.string().max(255).required().messages({
    'string.empty': 'Регион обязателен',
    'string.max': 'Регион не должен превышать 255 символов',
  }),
  settlement: Joi.string().max(255).required().messages({
    'string.empty': 'Город обязателен',
    'string.max': 'Город не должен превышать 255 символов',
  }),
  street: Joi.string().max(255).required().messages({
    'string.empty': 'Улица обязательна',
    'string.max': 'Улица не должна превышать 255 символов',
  }),
  house: Joi.string().max(50).required().messages({
    'string.empty': 'Дом обязателен',
    'string.max': 'Номер дома не должен превышать 50 символов',
  }),
  housing: Joi.string().max(50).allow('').messages({
    'string.max': 'Корпус не должен превышать 50 символов',
  }),
  flat: Joi.string().max(50).allow('').messages({
    'string.max': 'Квартира не должна превышать 50 символов',
  }),
  deleted_at: Joi.date().optional().allow(null),
}).unknown(true);

// Основная схема сотрудника
const employeeSchema = Joi.object({
  id: Joi.number().integer().optional(),
  name: Joi.string().max(100).required().messages({
    'string.empty': 'Имя обязательно',
    'string.max': 'Имя не должно превышать 100 символов',
  }),
  surname: Joi.string().max(100).required().messages({
    'string.empty': 'Фамилия обязательна',
    'string.max': 'Фамилия не должна превышать 100 символов',
  }),
  second_name: Joi.string().max(100).allow('').messages({
    'string.max': 'Отчество не должно превышать 100 символов',
  }),
  date_birth: Joi.date().iso().required().messages({
    'date.base': 'Дата рождения некорректна',
    'any.required': 'Дата рождения обязательна',
  }),
  position_id: Joi.number().integer().positive().required().messages({
    'number.base': 'Должность должна быть выбрана',
    'any.required': 'Поле "Должность" обязательно',
  }),
  passport_id: Joi.number().integer().optional(),
  address_id: Joi.number().integer().optional(),
  deleted_at: Joi.date().optional(),
  passport: passportSchema,
  address: addressSchema,
})
  .unknown(true) // Разрешаем дополнительные поля, но они не будут конфликтовать
  .fork(
    ['passport_id', 'address_id', 'deleted_at'],
    (schema) => schema.forbidden() // Запрещаем эти поля
  );
