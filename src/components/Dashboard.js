import React, { useEffect, useState } from 'react';
import { api } from '../api/mockApi';
import { Layout } from './Layout';
import { Users, Shield, ArrowUp, ArrowDown, RefreshCcw, Activity, LayoutDashboard } from 'lucide-react';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRoles: 0,
    activeUsers: 0,
    activeRoles: 1,
    lastUpdated: null,
    userChange: 5,
    roleChange: 2,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    setIsRefreshing(true);
    try {
      const [users, roles] = await Promise.all([api.getUsers(), api.getRoles()]);
      setStats((prev) => ({
        totalUsers: users.length,
        totalRoles: roles.length,
        activeUsers: Math.floor(users.length * 0.8),
        activeRoles: roles.filter((role) =>
          users.some((user) => user.roleId === role.id)
        ).length,
        lastUpdated: new Date(),
        userChange: prev.userChange,
        roleChange: prev.roleChange,
      }));
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, change, subtitle }) => (
    <div className="relative group">
      {/* Card Background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-80" />
      <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl border border-gray-200 transition-all duration-300">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Icon and Title */}
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20">
                <Icon className="h-6 w-6 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="ml-4">
                <dt className="text-sm font-medium text-gray-500 group-hover:text-blue-600">
                  {title}
                </dt>
                <dd className="mt-1 text-3xl font-bold text-gray-900">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-24 rounded" />
                  ) : (
                    value.toLocaleString()
                  )}
                </dd>
                {subtitle && (
                  <p className="text-sm text-gray-500 mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            {/* Change Indicator */}
            {change !== undefined && (
              <div
                className={`flex items-center ${
                  change >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {change >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                <span className="ml-1 text-sm font-medium">
                  {Math.abs(change)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="space-y-2 relative p-4 md:p-6">
        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center">
            <LayoutDashboard className="w-8 h-8 mr-3 text-blue-500" />
            Dashboard Overview
          </h1>
          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50"
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow-md">
            <div className="flex items-center">
              <Activity className="h-5 w-5 text-red-500" />
              <span className="ml-3 text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            change={stats.userChange}
            subtitle={`${stats.activeUsers} active users`}
          />
          <StatCard
            title="Total Roles"
            value={stats.totalRoles}
            icon={Shield}
            change={stats.roleChange}
            subtitle={`${stats.activeRoles} active roles`}
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            icon={Activity}
            subtitle="Currently online"
          />
        </div>

        {/* Last Updated */}
        {stats.lastUpdated && (
          <p className="text-sm text-gray-500 mt-4">
            Last updated: {stats.lastUpdated.toLocaleString()}
          </p>
        )}
      </div>
    </Layout>
  );
};
