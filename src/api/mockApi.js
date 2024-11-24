import { initialUsers, initialRoles } from './mockData';

class MockApi {
  constructor() {
    this.users = [...initialUsers];
    this.roles = [...initialRoles];
  }

  // User APIs
  async getUsers() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.users]);
      }, 500);
    });
  }

  async getUserById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = this.users.find(u => u.id === id);
        if (user) {
          resolve({ ...user });
        } else {
          reject(new Error('User not found'));
        }
      }, 500);
    });
  }

  async createUser(userData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          id: this.users.length + 1,
          ...userData
        };
        this.users.push(newUser);
        resolve(newUser);
      }, 500);
    });
  }

  async updateUser(id, userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.users.findIndex(u => u.id === id);
        if (index !== -1) {
          this.users[index] = { ...this.users[index], ...userData };
          resolve(this.users[index]);
        } else {
          reject(new Error('User not found'));
        }
      }, 500);
    });
  }

  async deleteUser(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.users.findIndex(u => u.id === id);
        if (index !== -1) {
          this.users.splice(index, 1);
          resolve(true);
        } else {
          reject(new Error('User not found'));
        }
      }, 500);
    });
  }

  // Role APIs
  async getRoles() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.roles]);
      }, 500);
    });
  }

  async getRoleById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const role = this.roles.find(r => r.id === id);
        if (role) {
          resolve({ ...role });
        } else {
          reject(new Error('Role not found'));
        }
      }, 500);
    });
  }

  async createRole(roleData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRole = {
          id: this.roles.length + 1,
          ...roleData
        };
        this.roles.push(newRole);
        resolve(newRole);
      }, 500);
    });
  }

  async updateRole(id, roleData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.roles.findIndex(r => r.id === id);
        if (index !== -1) {
          this.roles[index] = { ...this.roles[index], ...roleData };
          resolve(this.roles[index]);
        } else {
          reject(new Error('Role not found'));
        }
      }, 500);
    });
  }

  async deleteRole(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.roles.findIndex(r => r.id === id);
        if (index !== -1) {
          this.roles.splice(index, 1);
          resolve(true);
        } else {
          reject(new Error('Role not found'));
        }
      }, 500);
    });
  }
}

export const api = new MockApi();