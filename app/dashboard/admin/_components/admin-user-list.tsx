"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, updateUserStatus } from "../actions";
import {
  Users,
  UserCheck,
  Ban,
  Shield,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api-client";
import type { User } from "@/lib/types";

export function AdminUserList() {
  const queryClient = useQueryClient();
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const queryKey = ["admin-users", roleFilter, statusFilter, page];

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey,
    queryFn: () => fetchUsers({ role: roleFilter, status: statusFilter, page, limit: 10 }),
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "ACTIVE" | "BANNED" }) =>
      updateUserStatus(id, status),
    onMutate: async ({ id, status }) => {
      setProcessingId(id);
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<{
        users: User[];
        meta: { page: number; limit: number; total: number; totalPages: number };
      }>(queryKey);

      if (previousData) {
        queryClient.setQueryData(queryKey, {
          ...previousData,
          users: previousData.users.map((u) =>
            u.id === id ? { ...u, status } : u
          ),
        });
      }

      return { previousData };
    },
    onSuccess: (responseData, variables) => {
      const actionText = variables.status === "BANNED" ? "banned" : "activated";
      toast.success(`User successfully ${actionText}!`);
    },
    onError: (err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      if (err instanceof ApiError) {
        toast.error(err.message || "Failed to update user status");
      } else {
        toast.error("Failed to update user status");
      }
    },
    onSettled: () => {
      setProcessingId(null);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  const handleToggleStatus = (user: User) => {
    const nextStatus = user.status === "ACTIVE" ? "BANNED" : "ACTIVE";
    const confirmText =
      user.status === "ACTIVE"
        ? `Are you sure you want to ban ${user.name}?`
        : `Are you sure you want to unban ${user.name}?`;

    if (confirm(confirmText)) {
      mutation.mutate({ id: user.id, status: nextStatus });
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-300">
            <Shield className="h-3 w-3" />
            ADMIN
          </span>
        );
      case "LANDLORD":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-300">
            LANDLORD
          </span>
        );
      case "TENANT":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-300">
            TENANT
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-5">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-white">
            <Users className="h-5 w-5 text-indigo-400" />
            Platform User Management
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            View all registered platform accounts and handle ban/unban moderation.
          </p>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs text-white">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={roleFilter || ""}
              onChange={(e) => {
                setRoleFilter(e.target.value || undefined);
                setPage(1);
              }}
              className="bg-transparent outline-none cursor-pointer"
            >
              <option value="" className="bg-slate-900">All Roles</option>
              <option value="TENANT" className="bg-slate-900">Tenant</option>
              <option value="LANDLORD" className="bg-slate-900">Landlord</option>
              <option value="ADMIN" className="bg-slate-900">Admin</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs text-white">
            <select
              value={statusFilter || ""}
              onChange={(e) => {
                setStatusFilter(e.target.value || undefined);
                setPage(1);
              }}
              className="bg-transparent outline-none cursor-pointer"
            >
              <option value="" className="bg-slate-900">All Statuses</option>
              <option value="ACTIVE" className="bg-slate-900">Active</option>
              <option value="BANNED" className="bg-slate-900">Banned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl border border-slate-800 bg-slate-800/40"
            />
          ))}
        </div>
      ) : isError || !data ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center">
          <p className="text-xs text-red-400">Failed to load platform users.</p>
          <button
            onClick={() => refetch()}
            className="mt-3 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500"
          >
            Retry
          </button>
        </div>
      ) : data.users.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/40 py-12 text-center">
          <Users className="h-10 w-10 text-slate-600" />
          <h3 className="mt-3 text-sm font-semibold text-slate-300">
            No matching users found
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Try adjusting your role or status filter selections.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/40 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">User Details</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {data.users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                  {/* Name */}
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-semibold text-white text-xs">{user.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        ID: {user.id.slice(0, 8)}...
                      </p>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-4 py-4">{getRoleBadge(user.role)}</td>

                  {/* Contact Info */}
                  <td className="px-4 py-4 text-xs space-y-0.5">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Mail className="h-3 w-3 text-slate-500 shrink-0" />
                      <span>{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <Phone className="h-3 w-3 text-slate-500 shrink-0" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        user.status === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  {/* Moderation Button */}
                  <td className="px-4 py-4 text-right">
                    {user.role === "ADMIN" ? (
                      <span className="text-xs text-slate-500 italic">Admin Protected</span>
                    ) : (
                      <button
                        onClick={() => handleToggleStatus(user)}
                        disabled={processingId === user.id}
                        className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-50 ${
                          user.status === "ACTIVE"
                            ? "border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                        }`}
                      >
                        {processingId === user.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : user.status === "ACTIVE" ? (
                          <Ban className="h-3.5 w-3.5" />
                        ) : (
                          <UserCheck className="h-3.5 w-3.5" />
                        )}
                        {user.status === "ACTIVE" ? "Ban User" : "Unban User"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {data.meta.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-400">
              <span>
                Page {data.meta.page} of {data.meta.totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="flex items-center gap-1 rounded-lg border border-slate-800 px-2.5 py-1 text-slate-300 hover:bg-slate-800 disabled:opacity-40"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(data.meta.totalPages, p + 1))}
                  disabled={page >= data.meta.totalPages}
                  className="flex items-center gap-1 rounded-lg border border-slate-800 px-2.5 py-1 text-slate-300 hover:bg-slate-800 disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
