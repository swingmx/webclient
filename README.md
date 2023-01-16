### Swing music client

This repo contains the client code for the swing music player.

### Setup

This project requires `Node v14` or newer and `yarn@1.22.19`. Install them first.

- [NodeJS](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com)

Clone the repository and install the dependencies.

```bash
git clone https://github.com/geoffrey45/swing-client.git

cd swing-client

# Install dependencies
yarn install

# Start the development server
yarn dev

# Build the project
yarn build
```

If you are developing together with the server, make sure the server code is placed in the same directory as the client code. Such that when you run `yarn build` the output is placed in the server's `client` directory.

```bash
│ 
├── swing-client
│   └── # client code here
├── swingmusic
│   └── # server code here
```

### Contributing

If you want to contribute to this project, feel free to open a pull request with you changes. All bug reports and contributions are welcome.

---

**[MIT License](https://opensource.org/licenses/MIT) | Copyright (c) 2023 Mungai Njoroge**
