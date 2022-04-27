# playdust-ui

## Development Setup

### Getting Started
```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

### Environment variables

The following variables are needed to connect to deployed DBs/APIs:

- OPENSEARCH_USER
- OPENSEARCH_PASSWORD
- OPENSEARCH_URL
- PLAYDUST_API_HOST

These should be added to an `.env` file, values can be found in [Vercel](https://vercel.com/playdust/playdust-ui/settings/environment-variables)

NOTE: If the values of these variables are sent via Discord, a `/` may get appended to the OPENSEARCH_URL/PLAYDUST_API_HOST values. If the additional '/' are not removed, the local deployment will be unable to properly query OpenSearch.

### Local API connection

Enviroment variables are needed to connect to our API, follow these steps for correct configuration

- Clone API project [here](https://github.com/Coral-Reef-Art/auction-house-api)
- Run API project with another port (PORT=8000 npm run dev)
- Create a .env.local file in the root folder
- Add API_HOST key with API server URL as value

All those steps are for connection in local to our API.

### Husky and lint-staged

Husky and lint-staged are used for optimal linting, to use it run the following command:

```bash
yarn husky install
```

# Terminology 
### App

- the top level entity
- playdust-ui utilizes a single next.js page, that utilizes hash routing to move between **tabs**
- the playdust **app** contains 0 to many **tabs**

### Tab

- **Tabs** represents a list of **windows**
- Allows user to quickly flip between these **windows** and are persisted between sessions
- A playdust **tab** has 1 to many **windows**

### Page

- Each **page** takes a search-input as it's source of truth.
- A single **page** is rendering the results of it's search in isolation.
- 1 to many **pages**, within a parent **tab** can be viewed at once
- A **page** is responsible for bootstrapping itself, and composing its needed **modules**
- Each **page** shares the same interface for props
- **page** states are stored as strings, and each window is responsible for parsing its state

### TS Example

```typescript
export interface Page {
  state: string
  type: PageUnion
}

export interface Tab {
  id: string
  windows: Window[]
}

export interface App {
  tabs: Tab[]
  selectedTabId: string
}
```


# Coding Guidelines
> The guiding principle for the file/code structure is to be as self documenting as possible to avoid manual maintenance.
 ```
  src/
  ├─ App/
  ├─ api/
  ├─ types/
```

## `/api` 
The api folder contains all nextJS api endpoints in a folder structure following the data / URL structure.

## `/types`
`types/` contains all shared type definitions between the `api/` and `App/``

## `/App` (Component Folder Structure)

  ```
  MyComponent/
  ├─ atoms/
  │  ├─ myAtom.ts
  │  ├─ mySelector.ts
  ├─ hooks/
  │  ├─ useMyHook.ts
  ├─ helpers/
  │  ├─ myHelper.ts
  ├─ types/
  │  ├─ myType.ts
  ├─ sharedComponents/
  │  ├─ MySharedComponent/
  │  │  ├─ MySharedComponent.tsx
  │  │  ├─ [...]
  │  ├─ MyCommonGrid.tsx
  ├─ MyComponent.tsx
  ├─ MyComponentTitle.tsx
  ├─ MyComponentFooter.tsx
  ├─ MyComponentContent/
  │  ├─ MyComponentContent.tsx
  │  ├─ [...]
  ```
1. ### One Single export per file
    To keep the file structure self documenting, each file must only export a single `default` export which it is named after. iE. `MyComponent.tsx` exports `<MyComponent … />`

    > Typescript types can be exported in addition the single javascript export.
    
    > A file can define multiple components/atoms/selectors for internal use, but can only export the one it is named after.


1. ### Component Folders (vs. Single File)
   If a component becomes too complicated for a single file, a folder `ComponentName/` is created containing `ComponentName.tsx` and all files related to the component.

   > If reasonable, sub components are named `ComponentName[SubComponent].tsx`. This can be broken or abbrevated in order to prevent component names from getting too long.

1. ### Atoms (and Selectors)
    > Selectors are an implementation detail of atoms

    Atoms are split out into the `atoms/` folder within the component folder.

    > Reused Atoms are moved to the closes shared parent components `atoms/` folder.

1. ### Hooks
    All external and/or shared logic between components is using the hooks interface.

    Hooks are split out into a `hooks/` folder within the component folder and files are named after the hook they export `useMyHook.ts`

    > Reused Hooks are moved to the closest shared parent components `hooks/` folder.

1. ### Shared Components
    Usually all components are defined within their parent components folder.

    > Reused Components are moved to the closest shared parent components `sharedComponents/` folder.


1. ### Types
    Types should be defined as close to data creation as possible. 
    
    **Whenever possible, types should be defined, verified and exported alongside `atoms`.**

    > Reused types are moved to the closest shared parent components `types/`

1. ### Helpers
    Code that is reused between `atoms` and/or `hooks` goes into the `helpers/` folder.

    > Reused helpers are moved to the closest shared parent components `helpers/`



## Libraries/Conventions/Patterns

1. ### Styling Components

    - we are using `emotion` as our CSS implementation
      - the preferred method is to use the `emotion/styled` API to add styles to components
    - [VSCode Syntax Highlighting for styled components](https://marketplace.visualstudio.com/items?itemName=styled-components.vscode-styled-components)

1. ### AVOID: `setAtomValue` in component render cycle / `useEffect`
    > Writing to atoms should be triggered by events and not by the render loop.

    Using `setAtomValue` within `useEffect` creates an additional, (usually) avoidable, render loop.

    In (almost) all cases the logic in `useEffect` can be moved to a `selector` to avoid the problem.

    > There can be exceptions to this rule very high up in the app to set default environment atoms (if they can't be passed into `RecoilRoot` for some reason). These should be isolated and commented to explain their necessity.

