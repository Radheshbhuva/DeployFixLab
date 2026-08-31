import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../prisma';
import { RegisterInput, LoginInput } from './auth.validation';

const JWT_SECRET =
  process.env.JWT_SECRET || 'deployfix_lab_dev_jwt_secret_change_in_production_32bytes';
const ACCESS_TOKEN_EXPIRY = 900; // 15 minutes (in seconds)

export interface AuthSuccessPayload {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export class AuthService {
  /**
   * Registers a new user. Throws an error if email is already taken.
   */
  public static async registerUser(input: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (existingUser) {
      throw new Error('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const resolvedName = input.fullName || input.name || input.email.split('@')[0];
    const resolvedRole = (input.role as 'STUDENT' | 'INSTRUCTOR' | 'ADMIN') || 'STUDENT';

    const user = await prisma.user.create({
      data: {
        name: resolvedName,
        email: input.email.toLowerCase(),
        passwordHash,
        role: resolvedRole,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return user;
  }

  /**
   * Registers a new user and immediately logs them in with access and refresh tokens.
   */
  public static async registerAndLoginUser(input: RegisterInput): Promise<AuthSuccessPayload> {
    const user = await this.registerUser(input);

    // Generate short-lived Access Token
    const accessToken = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: `${ACCESS_TOKEN_EXPIRY}s` }
    );

    // Generate long-lived Refresh Token
    const refreshTokenString = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    // Persist refresh token in database
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshTokenString,
        expiresAt,
      },
    });

    return {
      accessToken,
      expiresIn: ACCESS_TOKEN_EXPIRY,
      refreshToken: refreshTokenString,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * Validates credentials and generates access/refresh tokens.
   */
  public static async loginUser(input: LoginInput): Promise<AuthSuccessPayload> {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate short-lived Access Token
    const accessToken = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: `${ACCESS_TOKEN_EXPIRY}s` }
    );

    // Generate long-lived Refresh Token
    const refreshTokenString = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    // Persist refresh token in database
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshTokenString,
        expiresAt,
      },
    });

    return {
      accessToken,
      expiresIn: ACCESS_TOKEN_EXPIRY,
      refreshToken: refreshTokenString,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * Performs social/OAuth login or registration for Google, GitHub, and Gmail.
   */
  public static async socialLoginUser(
    provider: 'google' | 'github' | 'gmail',
    requestedRole: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN' = 'STUDENT'
  ): Promise<AuthSuccessPayload> {
    const mockProfiles: Record<string, { email: string; name: string }> = {
      google: { email: 'cloud.engineer@gmail.com', name: 'Google Cloud Engineer' },
      github: { email: 'octocat.developer@github.com', name: 'GitHub Dev Operator' },
      gmail: { email: 'sre.operations@gmail.com', name: 'Gmail Workspace SRE' },
    };

    const profile = mockProfiles[provider] || { email: `user.${provider}@deployfix.lab`, name: `${provider} Engineer` };
    let user = await prisma.user.findUnique({
      where: { email: profile.email.toLowerCase() },
    });

    if (!user) {
      const passwordHash = await bcrypt.hash('OAuthSecret123!', 10);
      user = await prisma.user.create({
        data: {
          name: profile.name,
          email: profile.email.toLowerCase(),
          passwordHash,
          role: requestedRole,
        },
      });
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: `${ACCESS_TOKEN_EXPIRY}s` }
    );

    const refreshTokenString = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshTokenString,
        expiresAt,
      },
    });

    return {
      accessToken,
      expiresIn: ACCESS_TOKEN_EXPIRY,
      refreshToken: refreshTokenString,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * Rotates the refresh token and returns new access/refresh tokens.
   */
  public static async rotateRefreshToken(tokenString: string): Promise<AuthSuccessPayload> {
    const record = await prisma.refreshToken.findUnique({
      where: { token: tokenString },
      include: { user: true },
    });

    if (!record || record.isRevoked || record.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }

    // Revoke old token
    await prisma.refreshToken.update({
      where: { id: record.id },
      data: { isRevoked: true },
    });

    // Generate new Access Token
    const accessToken = jwt.sign(
      {
        id: record.user.id,
        name: record.user.name,
        email: record.user.email,
        role: record.user.role,
      },
      JWT_SECRET,
      { expiresIn: `${ACCESS_TOKEN_EXPIRY}s` }
    );

    // Generate new Refresh Token
    const newRefreshTokenString = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Save new Refresh Token
    await prisma.refreshToken.create({
      data: {
        userId: record.user.id,
        token: newRefreshTokenString,
        expiresAt,
      },
    });

    return {
      accessToken,
      expiresIn: ACCESS_TOKEN_EXPIRY,
      refreshToken: newRefreshTokenString,
      user: {
        id: record.user.id,
        name: record.user.name,
        email: record.user.email,
        role: record.user.role,
      },
    };
  }

  /**
   * Revokes a refresh token.
   */
  public static async revokeRefreshToken(tokenString: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { token: tokenString },
      data: { isRevoked: true },
    });
  }
}
