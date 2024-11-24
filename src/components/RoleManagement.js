import React, { useState, useEffect } from 'react';
import { api } from '../api/mockApi';
import {Layout} from './Layout';
import { 
  Shield, 
  Plus,
  Pencil,
  Trash2,
  X,
  AlertCircle,
  Loader,
  RefreshCcw
} from 'lucide-react';

export const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const [isRefreshing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: []
  });

  const availablePermissions = {
    users: ['users.read', 'users.write', 'users.delete'],
    roles: ['roles.read', 'roles.write', 'roles.delete']
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const data = await api.getRoles();
      setRoles(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingRole) {
        await api.updateRole(editingRole.id, formData);
      } else {
        await api.createRole(formData);
      }
      await fetchRoles();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      setError('Error saving role');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roleId) => {
    try {
      await api.deleteRole(roleId);
      setRoles(roles.filter(role => role.id !== roleId));
      setSelectedRole(null);
    } catch (error) {
      setError('Error deleting role');
    }
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingRole(null);
    setFormData({
      name: '',
      description: '',
      permissions: []
    });
    setError(null);
  };

  const handlePermissionToggle = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  return (
    <>
    {isModalOpen && (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="min-h-screen px-4 text-center flex items-center justify-center">
        <div className="fixed inset-0" onClick={() => setIsModalOpen(false)} />
        <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white rounded-2xl shadow-xl relative">
          {/* Decorative Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl" />
          {/* Modal Content */}
          <div className="relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {editingRole ? 'Edit Role' : 'Add New Role'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                {/* Role Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
                      placeholder="Enter role name"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400 resize-y min-h-[80px]"
                    placeholder="Enter role description"
                  />
                </div>

                {/* Permissions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                  <div className="space-y-4 bg-gray-50/50 p-3 rounded-xl">
                    {Object.keys(availablePermissions).map((category) => (
                      <div key={category} className="space-y-2">
                        <div className="text-sm font-medium text-indigo-600 capitalize">{category}</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {availablePermissions[category].map((permission) => (
                            <div
                              key={permission}
                              className="flex items-center bg-white/80 p-2 rounded-lg shadow-sm"
                            >
                              <input
                                type="checkbox"
                                checked={formData.permissions.includes(permission)}
                                onChange={() => handlePermissionToggle(permission)}
                                className="text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                              />
                              <label className="ml-2 text-sm text-gray-600">{permission}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-[120px] flex items-center justify-center"
                >
                  {loading ? (
                    <Loader className="w-5 h-5 text-white animate-spin" />
                  ) : editingRole ? (
                    'Update Role'
                  ) : (
                    'Create Role'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    )}

    <Layout>
      <div className="space-y-4 p-4 sm:p-6 relative">
        {/* Background Decoration - Made responsive */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50" />
          <div className="absolute top-1/3 left-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-1/4 w-36 sm:w-72 h-36 sm:h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Header - Made responsive */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent flex items-center">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-indigo-500" />
                Role Management
              </h1>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
                Configure and manage user roles and permissions
              </p>
            </div>
            <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={fetchRoles}
                disabled={loading}
                className="flex-1 sm:flex-none flex items-center justify-center px-3 sm:px-4 py-2 bg-white/80 backdrop-blur-lg text-indigo-600 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 border border-indigo-200 text-sm sm:text-base"
              >
                <RefreshCcw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setIsModalOpen(true);
                }}
                className="flex-1 sm:flex-none flex items-center justify-center px-4 sm:px-6 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Add Role
              </button>
            </div>
          </div>

          {/* Error Message - Made responsive */}
          {error && (
            <div className="bg-red-50/80 backdrop-blur-lg border-l-4 border-red-500 p-3 sm:p-4 rounded-xl shadow-lg">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-red-700">{error}</span>
              </div>
            </div>
          )}

          {/* Roles Table - Made responsive */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-80" />
            <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl border border-gray-200 transition-all duration-300">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-500 animate-spin" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                          Role Name
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                          Description
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                          Permissions
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/50">
                      {roles.map((role) => (
                        <tr 
                          key={role.id}
                          className={`
                            hover:bg-indigo-50/50 transition-all duration-200 cursor-pointer
                            ${selectedRole?.id === role.id ? 'bg-indigo-50/50' : ''}
                          `}
                          onClick={() => setSelectedRole(role)}
                        >
                          <td className="px-3 sm:px-6 py-4 sm:py-5">
                            <div className="text-sm sm:text-base font-medium text-gray-900">{role.name}</div>
                            <div className="text-xs text-gray-600 sm:hidden mt-1">{role.description}</div>
                          </td>
                          <td className="px-3 sm:px-6 py-4 sm:py-5 hidden sm:table-cell">
                            <div className="text-sm text-gray-600">{role.description}</div>
                          </td>
                          <td className="px-3 sm:px-6 py-4 sm:py-5">
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                              {role.permissions.map((permission) => (
                                <span
                                  key={permission}
                                  className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-indigo-100/80 text-indigo-800 hover:bg-indigo-200/80 transition-all duration-200"
                                >
                                  {permission}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-4 sm:py-5 text-right space-x-2 sm:space-x-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(role);
                              }}
                              className="text-indigo-600 hover:text-indigo-900 transition-all duration-200 p-1 sm:p-2 hover:bg-indigo-100/50 rounded-full"
                            >
                              <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(role.id);
                              }}
                              className="text-red-600 hover:text-red-900 transition-all duration-200 p-1 sm:p-2 hover:bg-red-100/50 rounded-full"
                            >
                              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default RoleManagement;