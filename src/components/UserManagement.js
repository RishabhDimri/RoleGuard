import React, { useState, useEffect } from 'react';
import { api } from '../api/mockApi';
import {Layout} from './Layout';
import { 
  Users,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  AlertCircle,
  Loader,
  Search
} from 'lucide-react';

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    roleId: '',
    status: 'active'
  });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await api.getRoles();
      setRoles(data);
    } catch (err) {
      setError('Failed to fetch roles');
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingUser) {
        await api.updateUser(editingUser.id, formData);
      } else {
        await api.createUser(formData);
      }
      await fetchUsers();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      setError('Error saving user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await api.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      setSelectedUser(null);
    } catch (error) {
      setError('Error deleting user');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      roleId: user.roleId,
      status: user.status
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      roleId: '',
      status: 'active'
    });
    setError(null);
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
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-5">
                  {/* Username Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
                        placeholder="Enter username"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  {/* Role Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={formData.roleId}
                        onChange={(e) => setFormData({ ...formData, roleId: Number(e.target.value) })}
                        className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 appearance-none"
                      >
                        <option value="">Select a role</option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Status Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 appearance-none"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
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
                    ) : editingUser ? (
                      'Update User'
                    ) : (
                      'Create User'
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
    <div className="space-y-2 relative p-4 md:p-6">
      {/* Background Decoration - Made responsive */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />
        <div className="absolute top-1/3 left-1/4 w-48 md:w-96 h-48 md:h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-36 md:w-72 h-36 md:h-72 bg-pink-400/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Responsive Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center">
            <Users className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3 text-blue-500" />
            User Management
          </h1>
          <p className="mt-1 md:mt-2 text-sm md:text-base text-gray-600">
            Manage system users and their assigned roles
          </p>
        </div>

        {/* Responsive Search and Add User */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
          <div className="relative flex-grow sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 md:py-3 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-xl"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 whitespace-nowrap"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* Responsive Error Message */}
      {error && (
        <div className="bg-white/80 backdrop-blur-lg border-l-4 border-red-500 p-3 md:p-4 rounded-xl shadow-xl text-sm md:text-base">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Responsive Users Table */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-80" />
        <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl border border-gray-200 transition-all duration-300 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader className="w-8 h-8 md:w-10 md:h-10 text-blue-500 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="hidden sm:table-cell px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="hidden md:table-cell px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-right text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className={`
                        hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-colors duration-200 cursor-pointer
                        ${selectedUser?.id === user.id ? 'bg-gradient-to-r from-blue-50 to-purple-50' : ''}
                      `}
                      onClick={() => setSelectedUser(user)}
                    >
                      <td className="px-4 md:px-6 py-4 md:py-5">
                        <div className="text-sm md:text-base font-medium text-gray-900">
                          {user.username}
                          <div className="sm:hidden text-xs text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-4 md:px-6 py-4 md:py-5">
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </td>
                      <td className="hidden md:table-cell px-4 md:px-6 py-4 md:py-5">
                        <div className="text-sm text-gray-600">
                          {roles.find(r => r.id === user.roleId)?.name || 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-5">
                        <span className={`
                          inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium
                          ${user.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'}
                        `}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-5 text-right space-x-2 md:space-x-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(user);
                          }}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-200 p-1.5 md:p-2 hover:bg-blue-100 rounded-full"
                        >
                          <Pencil className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(user.id);
                          }}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200 p-1.5 md:p-2 hover:bg-red-100 rounded-full"
                        >
                          <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
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
      

      {/* Mobile User Details Drawer */}
      {selectedUser && (
        <div className="md:hidden fixed inset-x-0 bottom-0 z-40 transform transition-transform duration-300 ease-in-out">
          <div className="bg-white rounded-t-xl shadow-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-gray-500">Email</label>
                <p className="text-sm text-gray-900">{selectedUser.email}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Role</label>
                <p className="text-sm text-gray-900">
                  {roles.find(r => r.id === selectedUser.roleId)?.name || 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Status</label>
                <span className={`
                  inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1
                  ${selectedUser.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'}
                `}>
                  {selectedUser.status}
                </span>
              </div>
              <div className="flex space-x-2 pt-2">
                <button
                  onClick={() => {
                    handleEdit(selectedUser);
                    setSelectedUser(null);
                  }}
                  className="flex-1 py-2 px-4 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleDelete(selectedUser.id);
                    setSelectedUser(null);
                  }}
                  className="flex-1 py-2 px-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Responsive Last Updated Text */}
      {!loading && (
        <p className="text-xs md:text-sm text-gray-500 mt-4 px-1">
          Last updated: {new Date().toLocaleString()}
        </p>
      )}

      {/* Empty State */}
      {!loading && filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
            <Users className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-sm md:text-base font-medium text-gray-900 mb-1">No users found</h3>
          <p className="text-xs md:text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding a new user'}
          </p>
        </div>
      )}
    </>
  );
};

export default UserManagement;