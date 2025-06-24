const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const dataToValidate = source === "body" ? req.body : req.params;
    const { error } = schema.validate(dataToValidate, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        error: {
          error: "Bad Request Validate",
          message: errorMessages,
        },
      });
    }
    next();
  };
};

module.exports = validate;
