const { createMongoAbility, subject } = require('@casl/ability');
const { accessibleBy } = require('@casl/mongoose');

const createAbilityForUser = (userId, permissions) => {
  const newPermissions = permissions.map((permission) => {
    const conditions = JSON.stringify(permission?.conditions || {}).replace(
      /\$userId/g,
      userId
    );
    return { ...permission, conditions: JSON.parse(conditions) };
  });

  return createMongoAbility(newPermissions);
};

const checkPermission = (user, action, subjectPermission, data) => {
  if (user.role.name === 'admin') {
    return true;
  }
  const abilityWithUser = createAbilityForUser(user.id, user.role.permissions);

  // console.log('abilityWithUser', abilityWithUser.rules);

  return abilityWithUser.can(
    action,
    action === 'readAll' ? subjectPermission : subject(subjectPermission, data)
  );
};

const getQueryBuilderForReadAll = (user, subjectPermission) => {
  const abilityWithUser = createAbilityForUser(user.id, user.role.permissions);
  return accessibleBy(abilityWithUser, 'read').ofType(subjectPermission);
};

module.exports = { checkPermission, getQueryBuilderForReadAll };
