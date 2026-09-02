import React, { useEffect, useState, useCallback } from 'react';
import { PageWrapper } from '@/components/ui/PageWrapper';
import {
  Users,
  Shield,
  Search,
  RefreshCw,
  GraduationCap,
  Award,
  Zap,
  Check,
  AlertCircle,
  Clock,
  BookOpen,
  CheckSquare,
} from 'lucide-react';
import { adminService, AdminUserListItem, UserStatsResponse } from '@/services/admin.service';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/components/ui/Toast';
import { UserRole } from '@/types/rbac.types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [stats, setStats] = useState<UserStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<UserRole | 'ALL'>('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Selected user for role change modal/confirmation
  const [targetUser, setTargetUser] = useState<AdminUserListItem | null>(null);
  const [newRoleSelection, setNewRoleSelection] = useState<UserRole>('STUDENT');
  const [isUpdating, setIsUpdating] = useState(false);

  const currentUser = useAuthStore((s) => s.user);
  const addToast = useToastStore((s) => s.addToast);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const roleParam = selectedRoleFilter === 'ALL' ? undefined : selectedRoleFilter;
      const res = await adminService.listUsers({
        page,
        limit: 15,
        search: search.trim() || undefined,
        role: roleParam,
      });

      setUsers(res.users);
      setTotalPages(res.pagination.totalPages);
      setTotalCount(res.pagination.total);
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.response?.data?.error?.message || 'Failed to load user roster',
      });
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedRoleFilter, addToast]);

  const fetchStats = useCallback(async () => {
    try {
      const statsRes = await adminService.getUserStats();
      setStats(statsRes);
    } catch (error) {
      console.error('Failed to load user statistics', error);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleOpenRoleModal = (user: AdminUserListItem) => {
    setTargetUser(user);
    setNewRoleSelection(user.role);
  };

  const handleConfirmRoleUpdate = async () => {
    if (!targetUser) return;
    if (targetUser.id === currentUser?.id && newRoleSelection !== 'ADMIN') {
      addToast({
        type: 'warning',
        message: 'Self-demotion is forbidden to avoid losing platform administrator access.',
      });
      return;
    }

    try {
      setIsUpdating(true);
      const updated = await adminService.updateUserRole(targetUser.id, newRoleSelection);

      addToast({
        type: 'success',
        message: `Updated ${updated.name}'s role to ${updated.role}`,
      });

      // Update state locally
      setUsers((prev) =>
        prev.map((u) => (u.id === updated.id ? { ...u, role: updated.role } : u))
      );

      setTargetUser(null);
      fetchStats();
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.response?.data?.error?.message || 'Failed to update user role',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Governance Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary flex items-center gap-3">
            Identity & Access Management
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Assign security roles, govern access clearances, and monitor user progress across DeployFix Lab.
          </p>
        </div>

        <Button
          variant="ghost"
          onClick={() => {
            fetchUsers();
            fetchStats();
          }}
          disabled={loading}
          className="flex items-center gap-2 self-start sm:self-auto text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Roster</span>
        </Button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-bg-surface border-border-default shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary font-medium">Total Users</p>
              <p className="text-2xl font-bold text-text-primary mt-1">
                {stats?.totalUsers ?? '...'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-brand-primary">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-bg-surface border-border-default shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-cyan-500 font-medium">Students</p>
              <p className="text-2xl font-bold text-text-primary mt-1">
                {stats?.studentCount ?? '...'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-bg-surface border-border-default shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-500 font-medium">DevOps/SRE Engineers</p>
              <p className="text-2xl font-bold text-text-primary mt-1">
                {stats?.instructorCount ?? '...'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-bg-surface border-border-default shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-rose-500 font-medium">Platform Admins</p>
              <p className="text-2xl font-bold text-text-primary mt-1">
                {stats?.adminCount ?? '...'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
              <Zap className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4 bg-bg-surface border-border-default shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-bg-primary border border-border-default text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary transition-colors"
          />
        </div>

        {/* Role Pills Filter */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {(['ALL', 'STUDENT', 'INSTRUCTOR', 'ADMIN'] as const).map((r) => {
            const roleLabels: Record<string, string> = {
              ALL: 'All Roles',
              STUDENT: 'Student',
              INSTRUCTOR: 'DevOps/SRE Engineer',
              ADMIN: 'Platform Admin',
            };
            return (
              <button
                key={r}
                onClick={() => {
                  setSelectedRoleFilter(r);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedRoleFilter === r
                    ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'bg-bg-raised text-text-secondary border border-transparent hover:bg-bg-raised/80 hover:text-text-primary'
                }`}
              >
                {roleLabels[r] || r}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Users Data Table */}
      <Card className="overflow-hidden bg-bg-surface border-border-default shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-bg-raised/70 text-text-muted font-mono uppercase tracking-wider border-b border-border-default">
              <tr>
                <th className="py-3.5 px-4 font-semibold">User Details</th>
                <th className="py-3.5 px-4 font-semibold">Role Clearance</th>
                <th className="py-3.5 px-4 font-semibold">Activity</th>
                <th className="py-3.5 px-4 font-semibold">Joined Date</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default/60">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-text-muted">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-500" />
                    <span>Loading identity records...</span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-text-muted">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-text-muted" />
                    <p className="text-sm text-text-secondary font-medium">No users found</p>
                    <p className="text-xs text-text-muted mt-1">Try adjusting your search criteria or role filters.</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const isCurrent = user.id === currentUser?.id;
                  const initials = user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .substring(0, 2);

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-bg-raised/50 transition-colors group"
                    >
                      {/* User Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-bg-raised border border-border-default flex items-center justify-center font-bold text-text-secondary text-xs">
                            {initials}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-text-primary">
                                {user.name}
                              </span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.2 text-[10px] rounded bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-mono">
                                  YOU
                                </span>
                              )}
                            </div>
                            <span className="text-text-muted text-[11px] block">{user.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        <RoleBadge role={user.role} size="sm" />
                      </td>

                      {/* Activity metrics */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3 text-text-secondary">
                          <span className="flex items-center gap-1" title="Enrolled Labs">
                            <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                            <span>{user._count?.labProgress || 0}</span>
                          </span>
                          <span className="flex items-center gap-1" title="Managed Tasks">
                            <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{user._count?.tasks || 0}</span>
                          </span>
                        </div>
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 text-text-muted font-mono text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-text-muted" />
                          <span>{formatDate(user.createdAt)}</span>
                        </div>
                      </td>

                      {/* Action Button */}
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenRoleModal(user)}
                          className="text-xs text-brand-primary hover:text-brand-hover hover:bg-bg-raised"
                        >
                          Modify Role
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 bg-bg-surface border-t border-border-default flex items-center justify-between text-xs text-text-secondary">
            <span>
              Showing {users.length} of {totalCount} users
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
              >
                Previous
              </Button>
              <span className="font-mono text-text-primary">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || loading}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Role Modification Modal */}
      {targetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-bg-surface border border-border-default rounded-2xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border-default">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand-primary" />
                <h3 className="font-bold text-text-primary text-base">Assign Security Role</h3>
              </div>
              <button
                onClick={() => setTargetUser(null)}
                className="text-text-muted hover:text-text-primary text-sm"
              >
                ✕
              </button>
            </div>

            <div>
              <p className="text-xs text-text-muted mb-1">Target Account:</p>
              <p className="text-sm font-semibold text-text-primary">
                {targetUser.name}{' '}
                <span className="text-xs text-text-muted font-mono">({targetUser.email})</span>
              </p>
            </div>

            {/* Role Radio Cards */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-secondary block">
                Select Clearance Level:
              </label>

              {(['STUDENT', 'INSTRUCTOR', 'ADMIN'] as UserRole[]).map((r) => {
                const isSelected = newRoleSelection === r;
                return (
                  <div
                    key={r}
                    onClick={() => setNewRoleSelection(r)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-brand-primary/10 border-brand-primary shadow-sm'
                        : 'bg-bg-raised/40 border-border-default hover:border-brand-primary/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'border-brand-primary bg-brand-primary'
                            : 'border-border-default bg-transparent'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                      </div>
                      <div>
                        <RoleBadge role={r} size="sm" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {targetUser.id === currentUser?.id && newRoleSelection !== 'ADMIN' && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  Warning: Demoting your own account will immediately revoke your access to this administration console.
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                onClick={() => setTargetUser(null)}
                disabled={isUpdating}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmRoleUpdate}
                disabled={isUpdating || targetUser.role === newRoleSelection}
                className="text-xs bg-brand-primary hover:bg-brand-hover text-white font-bold"
              >
                {isUpdating ? 'Applying...' : 'Confirm Role Change'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
    </PageWrapper>
  );
};
