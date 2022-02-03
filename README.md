# Marketplace Frontend

## Getting Started

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Project Layout

### `/pages`

- Hosts all Next.js pages/routes

### `/components`

- Location of common React Components to be used in the `/pages` directory

### `/provider`

- Directory for all providers, app will get wrapped in the index provider component

### `/hooks`

- Location of common hooks that can be used in `/components` & `/pages`

### `/store`

- Hosts all code associated with the Recoil store

### `/solana`

- Hosts query/helper functions to query the Solana blockchain

## Libraries/Conventions

### Styling Components

- we are using `emotion` as our CSS implementation
  - the preferred method is to use the `emotion/styled` API to add styles to components
- [VSCode Syntax Highlighting for styled components](https://marketplace.visualstudio.com/items?itemName=styled-components.vscode-styled-components)

## Husky and lint-staged

Husky and lint-staged are used for optimal linting, to use it run the following command:

```bash
yarn husky install
```

## Environment variables

The following variables are needed to connect to deployed DBs/APIs:

- OPENSEARCH_USER
- OPENSEARCH_PASSWORD
- OPENSEARCH_URL
- PLAYDUST_API_HOST
- AUCTION_HOUSE_PATH

These should be added to an `.env` file, values can be found in Vercel

## Local API connection

Enviroment variables are needed to connect to our API, follow these steps for correct configuration

- Clone API project [here](https://github.com/Coral-Reef-Art/auction-house-api)
- Run API project with another port (PORT=8000 npm run dev)
- Create a .env.local file in the root folder
- Add API_HOST key with API server URL as value

All those steps are for connection in local to our API.
