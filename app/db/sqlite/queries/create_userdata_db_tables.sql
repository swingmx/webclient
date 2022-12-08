CREATE TABLE IF NOT EXISTS playlists (
    id integer PRIMARY KEY,
    artisthashes text,
    image text,
    last_updated text not null,
    name text not null,
    trackhashes text
);