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

const getAllArtwork = (query) => {
  console.log('query', query);

  // return artworks;
};

const getOneArtwork = (artworkId) => {
  return artworks.find((artwork) => artwork.name === artworkId);
};

const createArtwork = (artwork) => {
  return artworks.push(artwork);
};

const updateArtwork = (artworkId, artwork) => {
  const index = artworks.findIndex((artwork) => artwork.name === artworkId);
  artworks[index] = { ...artworks[index], ...artwork };
};

const deleteArtwork = (artworkId) => {
  delete artworks[0];
};

const publishArtwork = (artworkId) => {
  const index = artworks.findIndex((artwork) => artwork.name === artworkId);
  artworks[index] = { ...artworks[index], publish: true };
};

const shareWithArtwork = (artworkId, shareWith) => {
  const index = artworks.findIndex((artwork) => artwork.name === artworkId);
  artworks[index] = {
    ...artworks[index],
    shareWith: (artworks[index] || []).push(shareWith),
  };
};

module.exports = {
  getAllArtwork,
  getOneArtwork,
  createArtwork,
  updateArtwork,
  deleteArtwork,
  publishArtwork,
  shareWithArtwork,
};
