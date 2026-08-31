import { describe, it, expect, vi } from 'vitest';
import {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  ROLE_PERMISSIONS,
} from '../types/rbac.types';
import { roleGuard } from '../middleware/roleGuard';
import { requirePermission } from '../middleware/permissionGuard';
import { Request, Response } from 'express';

describe('RBAC Permission Matrix', () => {
  it('should grant STUDENT access to basic lab and verification capabilities', () => {
    expect(hasPermission('STUDENT', 'labs:view_catalog')).toBe(true);
    expect(hasPermission('STUDENT', 'labs:start_sandbox')).toBe(true);
    expect(hasPermission('STUDENT', 'chaos:verify')).toBe(true);
    expect(hasPermission('STUDENT', 'diagnosis:query_basic')).toBe(true);
    expect(hasPermission('STUDENT', 'tasks:read_own')).toBe(true);
  });

  it('should forbid STUDENT from chaos injection, lab authoring, and user administration', () => {
    expect(hasPermission('STUDENT', 'chaos:inject_sandbox')).toBe(false);
    expect(hasPermission('STUDENT', 'labs:author_scenario')).toBe(false);
    expect(hasPermission('STUDENT', 'users:list_all')).toBe(false);
    expect(hasPermission('STUDENT', 'users:change_role')).toBe(false);
    expect(hasPermission('STUDENT', 'audit:view_global')).toBe(false);
  });

  it('should grant INSTRUCTOR chaos injection, lab authoring, and global audit view', () => {
    expect(hasPermission('INSTRUCTOR', 'chaos:inject_sandbox')).toBe(true);
    expect(hasPermission('INSTRUCTOR', 'labs:author_scenario')).toBe(true);
    expect(hasPermission('INSTRUCTOR', 'audit:view_global')).toBe(true);
    expect(hasPermission('INSTRUCTOR', 'telemetry:view_cohort')).toBe(true);
  });

  it('should forbid INSTRUCTOR from user role modification and fleet override', () => {
    expect(hasPermission('INSTRUCTOR', 'users:change_role')).toBe(false);
    expect(hasPermission('INSTRUCTOR', 'chaos:fleet_override')).toBe(false);
  });

  it('should grant ADMIN all permissions across all domains', () => {
    const allPermissions = ROLE_PERMISSIONS.ADMIN;
    expect(allPermissions.length).toBeGreaterThan(15);
    expect(hasPermission('ADMIN', 'users:change_role')).toBe(true);
    expect(hasPermission('ADMIN', 'users:list_all')).toBe(true);
    expect(hasPermission('ADMIN', 'chaos:fleet_override')).toBe(true);
    expect(hasPermission('ADMIN', 'audit:export_compliance')).toBe(true);
  });

  it('evaluates composite permission checks correctly', () => {
    expect(hasAllPermissions('INSTRUCTOR', ['labs:view_catalog', 'chaos:inject_sandbox'])).toBe(true);
    expect(hasAllPermissions('STUDENT', ['labs:view_catalog', 'chaos:inject_sandbox'])).toBe(false);
    expect(hasAnyPermission('STUDENT', ['chaos:inject_sandbox', 'labs:view_catalog'])).toBe(true);
  });
});

describe('roleGuard Middleware', () => {
  const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res as Response;
  };

  it('should return 401 if req.user is missing', () => {
    const req = {} as Request;
    const res = mockResponse();
    const next = vi.fn();

    const guard = roleGuard(['ADMIN']);
    guard(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if req.user role is not in allowedRoles', () => {
    const req = {
      user: { id: 'u1', email: 's@test.com', name: 'Student', role: 'STUDENT' },
    } as unknown as Request;
    const res = mockResponse();
    const next = vi.fn();

    const guard = roleGuard(['ADMIN', 'INSTRUCTOR']);
    guard(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next() if req.user role is authorized', () => {
    const req = {
      user: { id: 'u2', email: 'i@test.com', name: 'Instructor', role: 'INSTRUCTOR' },
    } as unknown as Request;
    const res = mockResponse();
    const next = vi.fn();

    const guard = roleGuard(['ADMIN', 'INSTRUCTOR']);
    guard(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe('permissionGuard Middleware', () => {
  const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res as Response;
  };

  it('should return 403 when user lacks specific permission', () => {
    const req = {
      user: { id: 'u1', email: 's@test.com', name: 'Student', role: 'STUDENT' },
    } as unknown as Request;
    const res = mockResponse();
    const next = vi.fn();

    const guard = requirePermission('chaos:inject_sandbox');
    guard(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('should allow access when role has specific permission', () => {
    const req = {
      user: { id: 'u2', email: 'i@test.com', name: 'Instructor', role: 'INSTRUCTOR' },
    } as unknown as Request;
    const res = mockResponse();
    const next = vi.fn();

    const guard = requirePermission('chaos:inject_sandbox');
    guard(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
