const Joi = require("joi");
const validate = require("../Middleware/validate");

const SchemaRoom = Joi.object({
  name: Joi.string().required().max(20).min(1).messages({
    "string.base": `"name" phải là một chuỗi`,
    "string.empty": `"name" không được để trống`,
    "string.min": `"name" phải có độ dài tối thiểu là {#limit}`,
    "string.max": `"name" phải có độ dài tối đa là {#limit}`,
    "any.required": `"name" là trường bắt buộc`,
  }),
  location: Joi.string().max(50).messages({
    "string.base": `"location" phải là một chuỗi`,
    "string.max": `"location" phải có độ dài tối đa là {#limit}`,
  }),
});
module.exports = { validateRoom: validate(SchemaRoom) };
