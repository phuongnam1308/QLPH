const Joi = require("joi");
const validate = require("../Middleware/validate");

const SchemaRoom = Joi.object({
  name: Joi.string().required().max(20).min(1).messages({
    "string.base": `name phải là một chuỗi`,
    "string.empty": `name không được để trống`,
    "string.min": `name phải có độ dài tối thiểu là {#limit}`,
    "string.max": `name phải có độ dài tối đa là {#limit}`,
    "any.required": `name là trường bắt buộc`,
  }),
  location: Joi.string().max(50).messages({
    "string.base": `location phải là một chuỗi`,
    "string.max": `location phải có độ dài tối đa là {#limit}`,
  }),
  capacity: Joi.number().integer().min(1).max(100).messages({
    "number.base": `capacity phải là một số`,
    "number.integer": `capacity phải là một số nguyên`,
    "number.min": `capacity phải lớn hơn hoặc bằng {#limit}`,
    "number.max": `capacity phải nhỏ hơn hoặc bằng {#limit}`,
  }),
  description: Joi.string().max(200).messages({
    "string.base": `description phải là một chuỗi`,
    "string.max": `description phải có độ dài tối đa là {#limit}`,
  }),
  equipment: Joi.string().max(100).messages({
    "string.base": `equipment phải là một chuỗi`,
    "string.max": `equipment phải có độ dài tối đa là {#limit}`,
  }),
  is_active: Joi.string().valid("available", "booked", "cancelled").messages({
    "string.base": `is_active phải là một chuỗi`,
    "any.only": `is_active phải là một trong các giá trị: 'available', 'booked', 'cancelled'`,
  }),
});
module.exports = { validateRoom: validate(SchemaRoom) };
