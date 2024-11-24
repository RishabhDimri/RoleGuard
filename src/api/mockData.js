export const initialUsers = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      status: 'active',
      roleId: 1
    },
    {
      id: 2,
      username: 'user',
      email: 'user@example.com',
      status: 'active',
      roleId: 2
    }
  ];
  
  export const initialRoles = [
    {
      id: 1,
      name: 'Admin',
      description: 'Full system access',
      permissions: ['users.read', 'users.write', 'users.delete', 'roles.read', 'roles.write', 'roles.delete']
    },
    {
      id: 2,
      name: 'User',
      description: 'Basic access',
      permissions: ['users.read', 'roles.read']
    }
  ];