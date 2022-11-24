CREATE VIRTUAL TABLE tracks using fts5 (
    album,
    albumartist,
    artists,
    title,
    trackhash,
    tokenize = 'porter unicode61'
);

CREATE VIRTUAL TABLE albums using fts5 (
    albumhash,
    albumartist,
    albumartisthashes,
    title,
    tokenize = 'porter unicode61'
);