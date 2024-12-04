const { createMongoAbility } = require('@casl/ability');

const { accessibleBy } = require('@casl/mongoose');

function main() {
  const ability = createMongoAbility([
    {
      action: 'manage',
      subject: 'Post',
      conditions: {
        userId: 1,
      },
    },
    {
      action: 'read',
      subject: 'Post',
      conditions: {
        shareWith: {
          $elemMatch: { userId: 1, permission: 'editor' },
        },
      },
    },
  ]);

  console.log(
    'query',
    JSON.stringify(accessibleBy(ability, 'read').ofType('Post'), null, 2)
  );
}

main();
