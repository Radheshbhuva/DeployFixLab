import { Request, Response, NextFunction } from 'express';
import { RegisterSchema, LoginSchema } from './auth.validation';
import { AuthService } from './auth.service';
import { AuditService } from '../audit/audit.service';

export class AuthController {
  /**
   * Handles user registration.
   */
  public static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = RegisterSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({
          success: false,
          statusCode: 400,
          error: {
            code: 'INVALID_INPUT_VALIDATION',
            message: 'Validation failed for request payload',
            details: result.error.errors.map((err) => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const user = await AuthService.registerUser(result.data);

      res.status(201).json({
        success: true,
        statusCode: 201,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      if (error.message === 'Email is already registered') {
        res.status(409).json({
          success: false,
          statusCode: 409,
          error: {
            code: 'USER_ALREADY_EXISTS',
            message: error.message,
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }
      next(error);
    }
  }

  /**
   * Handles user login.
   */
  public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = LoginSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({
          success: false,
          statusCode: 400,
          error: {
            code: 'INVALID_INPUT_VALIDATION',
            message: 'Validation failed for request payload',
            details: result.error.errors.map((err) => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const authData = await AuthService.loginUser(result.data);

      await AuditService.log(authData.user.id, 'LOGIN', 'USER', { email: authData.user.email });

      // Set long-lived refresh token in HTTP-only cookie
      res.cookie('refreshToken', authData.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/api/v1/auth/refresh',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        success: true,
        statusCode: 200,
        data: {
          accessToken: authData.accessToken,
          expiresIn: authData.expiresIn,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      if (error.message === 'Invalid email or password') {
        res.status(401).json({
          success: false,
          statusCode: 401,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: error.message,
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }
      next(error);
    }
  }

  /**
   * Retrieves the current authenticated user profile.
   */
  public static async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          statusCode: 401,
          error: {
            code: 'UNAUTHORIZED_NO_TOKEN',
            message: 'User profile not loaded',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.status(200).json({
        success: true,
        statusCode: 200,
        data: {
          user: {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role,
          },
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Rotates access and refresh tokens using HttpOnly cookie rotation.
   */
  public static async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        res.status(401).json({
          success: false,
          statusCode: 401,
          error: {
            code: 'UNAUTHORIZED_NO_TOKEN',
            message: 'Refresh token is missing',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const authData = await AuthService.rotateRefreshToken(refreshToken);

      // Set new refresh token in cookie
      res.cookie('refreshToken', authData.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/api/v1/auth/refresh',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        statusCode: 200,
        data: {
          accessToken: authData.accessToken,
          expiresIn: authData.expiresIn,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      if (error.message === 'Invalid or expired refresh token') {
        res.status(401).json({
          success: false,
          statusCode: 401,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: error.message,
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }
      next(error);
    }
  }

  /**
   * Log out current user, revoking refresh tokens and wiping cookies.
   */
  public static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (refreshToken) {
        await AuthService.revokeRefreshToken(refreshToken);
      }

      // Clear HttpOnly refresh cookie
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/api/v1/auth/refresh',
      });

      if (req.user) {
        await AuditService.log(req.user.id, 'LOGOUT', 'USER', { email: req.user.email });
      }

      res.status(200).json({
        success: true,
        statusCode: 200,
        data: null,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }
}
