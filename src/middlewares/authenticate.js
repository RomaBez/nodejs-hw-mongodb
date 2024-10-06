import createHttpError from 'http-errors';

const authenticate = async (req, res, next) => {
  const authorization = req.get('Authorization');
  if (!authorization) {
    return next(createHttpError(401, 'Authorization header not found'));
  }
  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') {
    return next(
      createHttpError(401, 'Authorization header must have Bearer type'),
    );
  }
};

export default authenticate;
