CREATE TABLE
    IF NOT EXISTS tracks (
        id integer PRIMARY KEY,
        album text NOT NULL,
        albumartist text NOT NULL,
        albumhash text NOT NULL,
        albumid integer NOT NULL,
        artist text NOT NULL,
        bitrate integer NOT NULL,
        copyright text,
        date text NOT NULL,
        disc integer NOT NULL,
        duration integer NOT NULL,
        filepath text NOT NULL,
        folder text NOT NULL,
        genre text,
        title text NOT NULL,
        track integer NOT NULL,
        trackhash text NOT NULL,
        FOREIGN KEY (albumid) REFERENCES albums (id)
    );

CREATE TABLE
    IF NOT EXISTS albums (
        id integer PRIMARY KEY,
        albumartist text NOT NULL,
        albumartistid text NOT NULL,
        albumhash text NOT NULL,
        colors text,
        copyright text,
        date text NOT NULL,
        title text NOT NULL,
        FOREIGN KEY (albumartistid) REFERENCES artists (id)
    );

CREATE TABLE
    IF NOT EXISTS playlists (
        id integer PRIMARY KEY,
        artistids text,
        image text,
        last_updated text not null,
        name text not null,
        thumb text,
        trackids text
    );

CREATE TABLE
    IF NOT EXISTS artists (
        id integer PRIMARY KEY,
        name text NOT NULL,
        artistid text NOT NULL,
        bio text,
        image text
    );