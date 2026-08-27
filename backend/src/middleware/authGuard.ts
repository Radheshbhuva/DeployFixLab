import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET =
  process.env.JWT_SECRET || 'deployfix_lab_dev_jwt_secret_change_in_production_32bytes';

export const authGuard = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      statusCode: 401,
      error: {
        code: 'UNAUTHORIZED_NO_TOKEN',
        message: 'Authorization header or Bearer token missing',
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({
      success: false,
      statusCode: 401,
      error: {
        code: 'UNAUTHORIZED_NO_TOKEN',
        message: 'Bearer token is empty',
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        res.status(401).json({
          success: false,
          statusCode: 401,
          error: {
            code: 'TOKEN_EXPIRED',
            message: 'JWT access token expired',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.status(401).json({
        success: false,
        statusCode: 401,
        error: {
          code: 'UNAUTHORIZED_NO_TOKEN',
          message: 'Invalid authorization token',
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Attach decoded user info to request
    req.user = decoded as { id: string; name?: string; email: string; role: string };
    next();
  });
};
