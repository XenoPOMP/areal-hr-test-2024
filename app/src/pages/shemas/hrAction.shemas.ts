import Joi from 'joi';

export { actionSchema };

const actionSchema = Joi.object({
  id: Joi.number().optional().allow(null),
  action_type: Joi.string().max(50).required().messages({
    'string.empty': 'Тип операции обязателен',
    'string.max': 'Тип операции не должен превышать 50 символов',
  }),
  date: Joi.date().required().messages({
    'date.base': 'Дата операции обязательна',
  }),
  salary: Joi.number().positive().required().messages({
    'number.base': 'Зарплата должна быть положительным числом',
    'number.empty': 'Зарплата обязательна',
  }),
  employee_id: Joi.number().integer().required().messages({
    'number.base': 'Необходимо выбрать сотрудника',
  }),
  department_id: Joi.number().integer().required().messages({
    'number.base': 'Необходимо выбрать отдел',
  }),
  position_id: Joi.number().integer().required().messages({
    'number.base': 'Необходимо выбрать должность',
  }),
}).unknown(false);
