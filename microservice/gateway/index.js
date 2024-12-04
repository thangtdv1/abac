const { getAllArtwork, createArtwork, getOneArtwork } = require('../artwork');
const { checkPermission, getQueryBuilderForReadAll } = require('../auth');
const { getUser } = require('../team');

const ADMIN_ARTWORK = () => {
  console.log('----- admin artwork ------');
  const admin_1 = getUser('admin_1');
  const isAdmin = checkPermission(admin_1);

  console.log(isAdmin && 'full access');
  console.log('----- ------- ------');
};

ADMIN_ARTWORK();

const USER_ARTWORK = () => {
  console.log('----- user artwork ------');

  const member_1 = getUser('member_1');
  const isHasReadAll = checkPermission(member_1, 'readAll', 'Artwork');

  if (isHasReadAll) {
    const queryBuilder = getQueryBuilderForReadAll(member_1, 'Artwork');

    console.log('member has read all', queryBuilder);
  } else {
    console.log('member no has read all');
  }

  const isUpdateOther = checkPermission(member_1, 'update', 'Artwork', {
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
  });

  console.log('member has update other', isUpdateOther);

  console.log('----- ------- ------');
};

USER_ARTWORK();

const CONTRIBUTE_ARTWORK = () => {
  console.log('----- user artwork ------');

  const contributor_1 = getUser('contributor_1');
  const isHasReadAll = checkPermission(contributor_1, 'readAll', 'Artwork');

  if (isHasReadAll) {
    const queryBuilder = getQueryBuilderForReadAll(contributor_1, 'Artwork');
    console.log('contributor_1 has read all', queryBuilder);
  } else {
    console.log('contributor_1 no has read all');
  }

  const artwork = getOneArtwork('artwork 2');
  console.log('artwork', artwork);

  const isReadOwner = checkPermission(
    contributor_1,
    'readOwner',
    'Artwork',
    artwork
  );
  console.log('contributor_1 has read owner', isReadOwner);

  const isUpdateOther = checkPermission(contributor_1, 'update', 'Artwork', {
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
  });
  console.log('contributor_1 has update other', isUpdateOther);

  const isPublishArtwork = checkPermission(
    contributor_1,
    'publish',
    'Artwork',
    {
      name: 'artwork 1',

      isPublish: true,
    }
  );
  console.log('contributor_1 has publish artwork', isPublishArtwork);

  console.log('----- ------- ------');
};

CONTRIBUTE_ARTWORK();
