# Welcome to Alice Core

This is the engine that runs the Alice music application.

### What is Alice?

Simply put, Alice is a browser-based music player for playing local music files.

### How does this work?

Thank you for asking. Basically, the server checks your files and extracts metadata from them, stores it in a databases and then makes it available to the browser using a REST API.

The server goes through all your folders in the `~/` directory and checks if they have audio files. If there are, it extracts it using [`mutagen`](https://mutagen.readthedocs.io/en/latest/) and stores it in a database. After processing all files, it uses the data in the database to create album data. This includes the album art, album artist, etc.

The browser client communicates with the server via a REST API interface built using Flask which just reads data from the database. When you want to view tracks in some directory, you just send a POST request to the Flask app with the path you want to access and the server will return a JSON response of all folders and files that match that directory in the database.

Everything in the server revolves around reading files, communicating with the database and processing requests.

### Development setup

To locally setup Alice **development** server on your machine, you are required to have the following tools installed in your machine:

1. **Python 3**

   You can check your installed version using `python3 --version`.
   Refer to the Python [downloads page](https://www.python.org/downloads/) for fresh installation.

2. **[Python Poetry](https://python-poetry.org/)** - Manages project dependencies and virtual environment.

   Refer to [Python Poetry installation docs](https://python-poetry.org/docs/) for fresh installation.

3. MongoDB (at least for now) - For storing your music data.

   Refer to the [MongoDB community edition installation directory](https://www.mongodb.com/docs/manual/administration/install-community/).

> Note: MongoDB should be accessible at `mongodb://localhost:27017` which is the default port.

Once you have all the above installed, clone the repo.

### Linux

```sh
# using https
git clone https://github.com/geoffrey45/alice.git

# using ssh
git clone git@github.com:geoffrey45/alice.git
```

Now cd into the project directory and make the start script executable.

```sh
chmod a+x ./start.sh
```

Now run the start script.

```sh
./start.sh
```

That's it. The server should be running on [`localhost:1970`](https://localhost:1970). Reload Alice client and enjoy.

### The server config folder

The server config folder is located at `~/.alice`. It looks something like this:

```sh
./alice
├── assets # static files
│   └── default.webp # fallback thumbnail
└── images
    ├── artists      # images downloaded from Deezer
    ├── playlists    # playlist thumbnails
    └── thumbnails   # album thumbnails
```

All album thumbnails extracted from your music files are stored as `.webp` for a smaller size. All images are converted to `.webp` before storage.

### Music data storage

Currently, all data related to Alice is stored in MongoDB. The server creates a single collections named `ALICE_SERVER` with multiple documents inside it.

1. `ALBUMS` - Stores album data
2. `TRACKS` - Stores file tags and other related data like bitrate.
3. `PLAYLISTS` - Stores playlist data.

### Contributing