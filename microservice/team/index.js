const users = [
  {
    id: 'admin_1',
    name: 'admin_1',
    role: 'admin',
  },

  {
    id: 'contributor_1',
    name: 'contributor_1',
    role: 'contributor',
  },
  {
    id: 'contributor_2',
    name: 'contributor_2',
    role: 'contributor',
  },
  {
    id: 'member_1',
    name: 'member_1',
    role: 'member',
  },
];

const roles = [
  {
    id: 'admin',
    name: 'admin',
    permissions: ['permission_1'],
  },

  {
    id: 'contributor',
    name: 'contributor',
    permissions: [
      'permission_2',
      'permission_4',
      'permission_5',
      'permission_7',
    ],
  },
  {
    id: 'member',
    name: 'member',
    permissions: ['permission_1.1', 'permission_1.2'],
  },
];

const permissions = [
  {
    id: 'permission_1',
    action: 'manage',
    subject: 'all',
  },
  {
    id: 'permission_1.1',
    action: 'manage',
    subject: 'Artwork',
  },
  {
    inverted: true,
    id: 'permission_1.2',
    action: 'shareWith',
    subject: 'Artwork',
  },
  {
    id: 'permission_2',
    action: 'manage',
    subject: 'Artwork',
    conditions: { userId: '$userId' },
  },
  {
    id: 'permission_4',
    action: 'read',
    subject: 'Artwork',
    conditions: {
      shareWith: {
        $elemMatch: {
          userId: '$userId',
          role: { $in: ['viewer', 'editor'] },
        },
      },
    },
  },
  {
    id: 'permission_5',
    action: 'update',
    subject: 'Artwork',
    conditions: {
      shareWith: { $elemMatch: { userId: '$userId', role: 'editor' } },
    },
  },
  {
    inverted: true,
    id: 'permission_7',
    action: 'publish',
    subject: 'Artwork',
  },
];

const getUser = (userId) => {
  const user = users.find((user) => user.id === userId);
  const userWithRole = {
    ...user,
    role: roles.find((role) => role.id === user.role),
  };
  const userWithRoleAndPermission = {
    ...userWithRole,
    role: {
      ...userWithRole.role,
      permissions: userWithRole.role.permissions.map((permissionInRole) => {
        const permission = permissions.find(
          (permission) => permission.id === permissionInRole
        );
        return permission;
      }),
    },
  };
  // console.log(JSON.stringify(userWithRoleAndPermission, null, 2));
  return userWithRoleAndPermission;
};

module.exports = { getUser };
