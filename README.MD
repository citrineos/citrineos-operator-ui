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

## Hasura Metadata

In order for Hasura to track the existing Citrine tables and relationships, this repository comes with Hasura metadata already exported into the `hasura-metadata` folder.
Running the Docker container will automatically import this metadata and track all tables and relationships.

Unfortunately, Hasura doesn't currently support importing metadata from a JSON (which is the format if you export your metadata from the Hasura UI or API).
Refer to this issue for more information: https://github.com/hasura/graphql-engine/issues/8423#issuecomment-1115996153.

Therefore, you must use the Hasura CLI to re-export your metadata, should something change with it. As explained in the Hasura docs https://hasura.io/docs/2.0/migrations-metadata-seeds/auto-apply-migrations/#auto-apply-metadata,
Hasura provides an image called `hasura/graphql-engine:<version>.cli-migrations-v3` that will process and import the metadata first before starting the server and
runs the Hasura CLI internally. You can follow these steps to re-export your metadata via the Hasura CLI in the `graphql-engine` container:

- (If not yet initialized) Initialize the Hasura project in the `graphql-engine` container (you can do this via the Docker Desktop `exec` view):

```
hasura-cli init
OR
hasura init

enter any name you wish for the project (i.e. citrine)
```

- Export the metadata by executing this command in `graphql-engine` container:

```
hasura-cli metadata export
OR
hasura metadata export
```

- Find the exported files in the `graphql-engine` container's files in the metadata filepath `<name of project i.e. citrine>/metadata` and pull that metadata backup onto your local machine
- Copy the contents of the copied `metadata` folder into the `hasura-metadata` folder in this repository

## Available Scripts

In order to function, CitrineOS's Postgres database must already be running! See [citrineos-core](https://github.com/citrineos/citrineos-core).

### Running with Docker

If you are running Citrine Core in Docker, Operator UI can be started by simply running:

```bash
docker compose up -d
```


### Running Operator UI Refine service via NPM

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

Now, you can run:

```bash
docker compose up -d graphql-engine data-connector-agent
```

to start the Hasura Engine and Data Connector containers in Docker and then run:

```bash
npm run dev
```

to start Operator UI via npm.

## Usage

Operator UI is at localhost:5173 if using development server, otherwise it is at localhost:3000.
The Hasura console is at localhost:8090.

## Learn More

To learn more about **Refine**, please check out the [Documentation](https://refine.dev/docs)

- **Hasura Data Provider** [Docs](https://refine.dev/docs/core/providers/data-provider/#overview)
- **Ant Design** [Docs](https://refine.dev/docs/ui-frameworks/antd/tutorial/)
- **React Router** [Docs](https://refine.dev/docs/core/providers/router-provider/)
- **Hasura v2 Graphql Engine** [Docs](https://hasura.io/docs/2.0/index/)
- **Hasura Postgres Data connector** [Docs](https://hasura.io/docs/2.0/databases/postgres/index/)
