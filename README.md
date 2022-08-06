# `alice-core` v0.1.0

This is the engine that runs the alice music application.

### What is alice?

Simply put, `alice` is a browser-based music player for playing local music files. It currently supports MP3 and FLAC file types. You need to install the `alice-server` package (this repo) to process your files. You can use it using the live `alice-client` at <https://alicemusic.netlify.app> or setup the client locally [from GitHub](https://github.com/geoffrey45/alice).

### How does this work?

`alice` works _quite similar_ to how streaming music on a streaming site works.

Basically, `alice-server` checks your files and extracts metadata from them, stores it in a databases and then makes it available to the browser using a REST API.

The server goes through all your folders in the `~/` directory and checks for audio files. It then extracts audio tags using [`mutagen`](https://mutagen.readthedocs.io/en/latest/) and stores them in a database. After processing all files, it scraps through the data to create albums.

The client communicates with the server via a REST API interface built using [`flask`](https://flask.palletsprojects.com), which just reads data from the database. When you want to view tracks in some folder, you just send a POST request to the Flask app with the path you want to access and the server will return a JSON response of all folders and files that match that directory in the database.

Everything in the server revolves around reading files, communicating with the database and processing requests.

### Development setup

To locally setup `alice` **development** copy on your machine, you are required to have the following tools installed in your machine:

1. **Python 3**

   You can check your installed version using `python3 --version`.
   Refer to the Python [downloads page](https://www.python.org/downloads/) for a fresh installation.

2. **[Python Poetry](https://python-poetry.org/)** - Manages project dependencies and virtual environment.

   Refer to [Python Poetry installation docs](https://python-poetry.org/docs/) for fresh installation.

3. MongoDB (at least for now) - For storing your music data.

   Refer to the [MongoDB community edition installation directory](https://www.mongodb.com/docs/manual/administration/install-community/).

> Note: MongoDB should be accessible at `mongodb://localhost:27017` which is the default port.

Once you have all the above installed, clone the repo.

#### On Linux

```sh
# using https
git clone https://github.com/geoffrey45/alice.git

# using ssh
git clone git@github.com:geoffrey45/alice.git
```

Now cd into the project directory and install dependencies.

```sh
cd alice

poetry install
```

Make the start script executable and run it.

```sh
chmod a+x ./start.sh

./start.sh -s
```

The `-s` flag is used to start the image server. Sometimes when you are killing the script, the image server might not be killed. In that case, you might need to start the music server alone using `./start.sh`.

That's it. The server should be running on [`localhost:1970`](https://localhost:1970). The client is set to communicate with `alice` on that specific port.

Please note:

The time taken to process your files for the first time depends on a few factors:

1. The amount of files you have
2. The access speed of disk they're stored on
3. You computer's processing power
4. Whether you love cats

`alice` doesn't use multi-processing to process files. If you have a thousands of music files, you might want to take a walk.

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

All images are converted to `.webp` before storage for a smaller file size.

### Music data storage

Currently, all data related to `alice` is stored in MongoDB. The server creates a single collections named `ALICE_SERVER` with multiple documents inside it.

1. `ALBUMS` - Stores album data
2. `TRACKS` - Stores file tags and other related data like bitrate.
3. `PLAYLISTS` - Stores playlist data.

### Contributing

If you like this project and would like to cotribute, please feel free to open an issue or a pull request.
