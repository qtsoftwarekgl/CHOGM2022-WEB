# CHOGM 2022

This is a mono-repo that hosts the backend and the frontend of CHOGM 2022 application. Leaders of Commonwealth countries meet every two years for the **Commonwealth Heads of Government Meeting (CHOGM)**, hosted by different member countries on a rotating basis.
## Stack used

This project is based on NX workspace and it uses the following stacks:
- NestJS `v8.0`
- MongoDB for data persistence
- Redis
- React `v16.8.0`
- TailwindCSS

## Prerequisites

By running this project on your environment, install the following dependencies:
- NodeJS
- MongoDB
- Redis
- NX (`npm install -g @nrwl/cli@latest`)

### Clone this repository

```bash
git clone git@github.com:nsanzumuhire/chogm2022.git
```

### Navigate to the root directory and install the dependencies

```bash
cd chogm2022

npm i
```

### Run the app

```bash
# running the backend
nx serve chogm-api

# running the client
nx serve chogm-ui
```

Happy coding 😄# CHOGM2022-WEB
