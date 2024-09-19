import createHttpError from 'http-errors';

const validateBody = (scheme) => {
  const func = async (req, res, next) => {
    try {
      await scheme.validateAsync(req.body, {
        abortEarly: false,
      });
      next();
    } catch (error) {
      const validateError = createHttpError(400, error.message);
      next(validateError);
    }
  };
  return func;
};

export default validateBody;
