import { createMongoAbility, subject } from '@casl/ability';
import { accessibleBy } from '@casl/mongoose';
const artworks = [
  {
    name: 'artwork 1',
    userId: 'admin_1',
    shareWith: [
      {
        userId: 'contributor_1',
        role: 'viewer',
      },
      {
        userId: 'contributor_2',
        role: 'editor',
      },
    ],
  },
  {
    name: 'artwork 2',
    userId: 'contributor_1',
    shareWith: [
      {
        userId: 'contributor_2',
        role: 'viewer',
      },
    ],
  },
  {
    name: 'artwork 3',
    userId: 'contributor_2',
    shareWith: [],
  },
  {
    name: 'artwork 4',
    userId: 'contributor_1',
    shareWith: [],
  },
  {
    name: 'artwork 5',
    userId: 'member_1',
    shareWith: [],
  },
];

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
    permissions: ['permission_1.1'],
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

const getUserWithRoleAndPermissions = (user) => {
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

const createAbilityForUser = (userId, permissions) => {
  const newPermissions = permissions.map((permission) => {
    const conditions = JSON.stringify(permission?.conditions || {}).replace(
      /\$userId/g,
      userId
    );
    return { ...permission, conditions: JSON.parse(conditions) };
  });
  // console.log('newPermissions', JSON.stringify(newPermissions, null, 2));

  return createMongoAbility(newPermissions);
};

const admin = () => {
  console.log('ADMIN ROLE:');

  const user = users[0];
  const userWithRoleAndPermission = getUserWithRoleAndPermissions(user);

  const abilityWithUser = createAbilityForUser(
    user.id,
    userWithRoleAndPermission.role.permissions
  );

  console.log(
    'querybuilder',
    JSON.stringify(
      accessibleBy(abilityWithUser, 'read').ofType('Artwork'),
      null,
      2
    )
  );

  // can manage all artwork
  const result1 = abilityWithUser.can(
    'manage',
    subject('Artwork', artworks[1])
  );
  console.log('can manage all artwork', result1 && ': YES');

  // can manage all user
  const result3 = abilityWithUser.can('manage', subject('User', users[0]));
  console.log('can manage all user', result3 && ': YES');
};

const member = () => {
  console.log('----');
  console.log('MEMBER ROLE:');
  const user = users[3];
  const userWithRoleAndPermission = getUserWithRoleAndPermissions(user);

  const abilityWithUser = createAbilityForUser(
    user.id,
    userWithRoleAndPermission.role.permissions
  );

  // can manage all artwork
  const result1 = abilityWithUser.can(
    'manage',
    subject('Artwork', artworks[4])
  );
  console.log('can manage all artwork', result1 && ': YES');

  // cannot manage all user
  const result3 = abilityWithUser.cannot('manage', subject('User', users[0]));
  console.log('cannot manage all user', result3 && ': YES');
};

const contributor2 = () => {
  console.log('----');
  console.log('CONTRIBUTOR ROLE:');

  const user = users[2];
  const userWithRoleAndPermission = getUserWithRoleAndPermissions(user);

  const abilityWithUser = createAbilityForUser(
    user.id,
    userWithRoleAndPermission.role.permissions
  );

  console.log(
    'query of read all yourself artwork',
    JSON.stringify(
      accessibleBy(abilityWithUser, 'read').ofType('Artwork'),
      null,
      2
    )
  );

  // can manage yourself artwork
  const result1 = abilityWithUser.can(
    'manage',
    subject('Artwork', artworks[2])
  );
  console.log('can manage yourself artwork', result1 && ': YES');

  // cannot publish artwork
  const result71 = abilityWithUser.cannot(
    'publish',
    subject('Artwork', artworks[2])
  );
  const result72 = abilityWithUser.cannot(
    'publish',
    subject('Artwork', artworks[0])
  );
  console.log('cannot publish myself artwork ', result71 && ': YES');
  console.log('cannot publish other artwork', result72 && ': YES');

  // can editor artwork share with role: editor
  const result2 = abilityWithUser.can(
    'update',
    subject('Artwork', artworks[0])
  );
  console.log('can editor artwork share with role: editor', result2 && ': YES');
  const result3 = abilityWithUser.can('read', subject('Artwork', artworks[0]));
  console.log('can view artwork share with role: editor', result3 && ': YES');
  const result4 = abilityWithUser.can('read', subject('Artwork', artworks[1]));
  console.log('can view artwork share with role: view', result4 && ': YES');

  // cannot delete artwork shared with role: editor
  const result5 = abilityWithUser.cannot(
    'delete',
    subject('Artwork', artworks[0])
  );
  console.log(
    'cannot delete artwork shared with role: editor',
    result5 && ': YES'
  );

  // cannot update artwork shared with role: view
  const result6 = abilityWithUser.cannot(
    'update',
    subject('Artwork', artworks[1])
  );
  console.log(
    'cannot update artwork shared with role: view',
    result6 && ': YES'
  );

  // cannot manage artwork no shared
  const result7 = abilityWithUser.cannot(
    'read',
    subject('Artwork', artworks[3])
  );
  console.log('cannot manage artwork no shared', result7 && ': YES');

  // cannot delete user
  const result8 = abilityWithUser.cannot('delete', subject('User', users[2]));
  console.log('cannot delete user', result8 && ': YES');
};

const main = () => {
  admin();
  member();
  contributor2();
};

main();
