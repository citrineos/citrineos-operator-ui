<!--
SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project

SPDX-License-Identifier: Apache-2.0
-->

![CitrineOS Logo](public/logo_white.png#gh-dark-mode-only)
![CitrineOS Logo](public/logo_black.png#gh-light-mode-only)

<div align="center">
<img src="public/OCPP_201_Logo_core_and_advanced_security.png" alt="CitrineOS Certification Logo" width="200" height="100" />
</div>

# Welcome to CitrineOS

CitrineOS is an open-source project aimed at providing a modular server runtime for managing Electric Vehicle (EV)
charging infrastructure.

# CitrineOS Operator

This is the repository for the Operator User Interface and associated tooling.

## How to Start

In order to function, CitrineOS Core must be running. The UI draws its data from the Hasura GraphQL Engine.
The Core Message and Data APIs are used for charging station commands.

### Running with Docker

If you are running [Citrine Core](https://github.com/citrineos/citrineos-core) in Docker, Operator UI can be started by simply running:

```bash
docker compose up -d
```

### Running Operator UI Refine service via NPM

## Building the project

For development convenience, Operator UI is configured with a workspace in `package.json`:

```json
"workspaces": [
  "../citrineos-core/00_Base"
]
```

and this will attempt to get `@citrineos/base` dependency from the `citrineos-core` folder if it is in same parent directory.
If that is the case, then you may need to run:

```bash
npm run build
```

in the `citrineos-core` directory, to ensure that the dependency to be available for Operator UI. Otherwise, you can
skip the step to build `citrineos-core` and move on to installing Operator UI:

```bash
npm install
```

## Running

Now, you can run:

```bash
npm run dev
```

to start Operator UI via npm.

## Usage

Operator UI is at localhost:5173 if using development server, otherwise it is at localhost:3000.

## Learn More

To learn more about **Refine**, please check out the [Documentation](https://refine.dev/docs)

- **Hasura Data Provider** [Docs](https://refine.dev/docs/core/providers/data-provider/#overview)
- **Ant Design** [Docs](https://refine.dev/docs/ui-frameworks/antd/tutorial/)
- **React Router** [Docs](https://refine.dev/docs/core/providers/router-provider/)
- **Hasura v2 Graphql Engine** [Docs](https://hasura.io/docs/2.0/index/)
- **Hasura Postgres Data connector** [Docs](https://hasura.io/docs/2.0/databases/postgres/index/)
