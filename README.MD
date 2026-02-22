<!--
SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project

SPDX-License-Identifier: Apache-2.0
-->

![CitrineOS Logo](public/logo_white.png#gh-dark-mode-only)
![CitrineOS Logo](public/logo_black.png#gh-light-mode-only)

<div align="center">
  <img
    src="public/OCPP_201_Logo_core_and_advanced_security.png"
    alt="CitrineOS Certification Logo"
    width="200"
    height="100"
  />
</div>

# Welcome to CitrineOS Operator UI

**CitrineOS Operator UI** is the web-based operator interface for **CitrineOS**, an open-source, modular backend
platform for managing Electric Vehicle (EV) charging infrastructure.

This repository contains the **Operator-facing User Interface** and related tooling.  
It is designed to work together with **CitrineOS Core**, which provides the charging station management logic,
OCPP message handling, persistence layer, and GraphQL APIs.

> ⚠️ **Important:**  
> The Operator UI **does not run standalone**.  
> A running instance of **CitrineOS Core** (including Hasura GraphQL Engine) is required.

---

## Table of Contents

- [Overview](#overview)
- [Architecture & Data Flow](#architecture--data-flow)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Running with Docker](#running-with-docker-recommended)
  - [Running with NPM (Local Development)](#running-with-npm-local-development)
- [Working with a Local `citrineos-core`](#working-with-a-local-citrineos-core)
- [Build & Development Workflow](#build--development-workflow)
- [Running the Application](#running-the-application)
- [Bringing a Charging Station Online (End-to-End)](#bringing-a-charging-station-online-end-to-end)
  - [Create a Location](#create-a-location)
  - [Add a Charging Station (Charge Point)](#add-a-charging-station-charge-point)
  - [Add an EVSE (Electric Vehicle Supply Equipment)](#add-an-evse-electric-vehicle-supply-equipment)
  - [Add a Connector](#add-a-connector)
  - [Add an Authorization (ID Token)](#add-an-authorization-id-token)
  - [Start the Charging Station (EVerest)](#start-the-charging-station-everest)
- [Usage](#usage)
- [Hasura Authentication](#hasura-authentication)
- [Related Documentation](#related-documentation)
- [Contributing](#contributing)
- [Licensing](#licensing)
- [Support & Contact](#support--contact)

---

## Overview

The CitrineOS Operator UI provides operators with:

- Visibility into charging stations, connectors, sessions, and transactions
- Operational controls via CitrineOS Core Message APIs
- Data access through **Hasura GraphQL Engine**
- A modern React-based UI built with **Refine**

The UI consumes:
- **Hasura GraphQL APIs** for data access
- **CitrineOS Core Message APIs** for sending commands to charging stations
- **CitrineOS Core Data APIs** for managing entities

---

## Architecture & Data Flow

```text
+-------------------+       GraphQL       +----------------------+
|                   |  <----------------> |                      |
|  Operator UI      |                     |  Hasura GraphQL      |
|                   |                     |  Engine              |
|                   |                     |                      |
+-------------------+                     +----------+-----------+
                                                       |
                                                       | SQL
                                                       |
                                             +---------v-----------+
                                             |                     |
                                             |  PostgreSQL         |
                                             |                     |
                                             +---------------------+

+-------------------+       REST       +--------------------------+
| Operator UI       | <--------------> | CitrineOS Core           |
|                   |                  | (OCPP 1.6 & 2.0.1)       |
+-------------------+                  +--------------------------+
```

## Prerequisites

Before starting, ensure the following tools and services are installed and running.
- **Node.js** (v24 or higher recommended)  
  [Link](https://nodejs.org)

- **npm**  
  Installed automatically with Node.js

- **Docker & Docker Compose** (recommended)  
  [Link](https://www.docker.com/products/docker-desktop/)

The following services must be available before starting the application:

- **CitrineOS Core**  
  Backend service responsible for OCPP 1.6 and OCPP 2.0.1 handling, charging station management, and APIs.

- **Hasura GraphQL Engine**  
  GraphQL layer used for data access and management.

References:

- **CitrineOS Core Repository**  
  [Documentation](https://github.com/citrineos/citrineos-core)

- **Hasura Documentation**  
  [Documentation](https://hasura.io/docs/2.0/)


## Getting Started

### Running with Docker (Recommended)

If **CitrineOS Core** is already running via Docker, the Operator UI can be started with a single command:

```bash
docker compose up -d
```

This will: 
- Build the Operator UI container 
- Start the UI connected to the configured Hasura and Core service

### Running with NPM (Local Development)

For local development without Docker:

```bash
npm install
npm run dev
```
This starts the development server with hot reload.

### Working with a Local `citrineos-core`

When developing Operator UI against a **local build of citrineos-core** (for example, a release candidate or feature branch),
you can link the core package using `npm link`.

### Step-by-step
1. Build CitrineOS Core first:

```bash
cd citrineos-core
npm run build
```

2. Link the base package:

```bash
cd 00_Base
npm link
```
3. Link it inside Operator UI:

```bash
cd citrineos-operator-ui
npm link @citrineos/base@X.X.X
```

> ⚠️ **Note:**
> Running `npm run fresh` or `npm run fi` will remove this link and you will need to re-link. 

## Build & Development Workflow
The Operator UI uses **npm workspaces** for local development convenience.

### Typical Workflow

1. Build CitrineOS Core: 

```bash
cd citrineos-core
npm run build
```

2. Install Operator UI dependencies:

```bash
cd citrineos-operator-ui
npm install
```

3. Start development server:

```bash
npm run dev
```

## Running the Application

### Development Mode

```bash
npm run dev
```

- Runs the app with hot reload
- Default URL: http://localhost:3000

### Production Build

```bash
npm run build
npm run preview
```

- Production preview URL: http://localhost:3000

## Bringing a Charging Station Online (End-to-End)

This section describes the **minimum operational steps** required to bring a charging station online using:

- **CitrineOS Operator UI**
- **CitrineOS Core**
- **EVerest simulator**

These steps are required even for local development and testing.

---

### Create a Location

In CitrineOS, **all charging stations must belong to a Location**.

1. Open **CitrineOS Operator UI**:
2. Navigate to:

```pgsql
Locations → Create Location
```

3. Fill in the required metadata (name, address, country, etc.)
4. Save the Location 

> A Location represents a physical site such as a parking garage, depot, or charging hub.

---

### Add a Charging Station (Charge Point)

To add a new charging station in CitrineOS Operator UI:

1. Navigate to: 

```sql
Charging Stations → Add Charging Station
```

2. Select the previously created **Location**.

3. Use the default **Charge Point ID**:  

```nginx 
cp001
```  

>⚠️ **Important:** 
The Charge Point ID must exactly match the ID used by your physical charging station or simulator.
By default, **EVerest** uses `cp001`.

4. Click **Save** to create the charging station.

---

### Add an EVSE (Electric Vehicle Supply Equipment)

Each Charging Station must contain at least one EVSE.

1. Open the Charging Station you just created.
2. Navigate to:  

```sql 
EVSEs → Add EVSE
```

3. Use a numeric **EVSE ID** (example: `1`).
4. Click **Save**.  

> EVSEs represent physical charge points within a station (e.g., left/right ports).

---

### Add a Connector

Each EVSE must have at least one Connector.

1. Open the EVSE.
2. Navigate to: 

```sql
Connectors → Add Connector
```

3. Choose:  
   - **Connector ID** (example: `1`)  
   - **Connector type** (Type2, CCS, etc.)
4. Click **Save**.  

> Without a Connector, charging sessions cannot be started.

---

### Add an Authorization (ID Token)

To allow charging sessions, an ID Token must be authorized.

1. Navigate to:  

```sql
Authorizations → Add Authorization
```

2. Create an **ID Token** (RFID, app token, etc.)
3. Mark it as **Accepted**
4. Click **Save**  

> ⚠️ Note: This token will be used by EVerest to start charging.
> The EVerest simulator uses the **default RFID token** `DEADBEEF` **(ISO14443)**.

---

### Start the Charging Station (EVerest)

Now that the backend configuration is complete, start the EVerest simulator:

```bash
cd citrineos-core/Server
npm run start-everest
```

This will:
**In Operator UI**
- Navigate to **Charging Stations**
- Status should show:

```nginx
Online
```

You can now track OCPP logs for the charging station.

## Usage

Once running, the Operator UI allows you to:
- View and manage charging stations and connectors
- Monitor transactions and sessions
- Trigger charging station commands (via CitrineOS Core)
- Query and manage data through Hasura-backed GraphQL APIs

## Hasura Authentication
There are two ways to authenticate to Hasura:

1. If you have **uncommented* the Docker environment variable `HASURA_GRAPHQL_ADMIN_SECRET` in `citrineos-core`: 2. Ensure your `.env.local` has the `HASURA_ADMIN_SECRET` uncommented out 3. Please note that it is not recommended to use a Hasura Admin Secret in production.
2. If you have commented the Docker environment variable `HASURA_GRAPHQL_ADMIN_SECRET` in `citrineos-core`: 5. Ensure your `.env.local` has the `HASURA_ADMIN_SECRET` commented out, as the auth will be handled by your auth provider automatically.

## Related Documentation

- **CitrineOS Core**
  - [Docs](https://github.com/citrineos/citrineos-core)
- **CitrineOS Project Docs**
  - [Docs](https://citrineos.github.io)
- **Refine**
  - [Docs](https://refine.dev/docs)
- **Hasura GraphQL Engine**
  - [Docs](https://hasura.io/docs/2.0/index/)
- **Postgres Data Connector**
  - [Docs](https://hasura.io/docs/2.0/databases/postgres/index/)

## Contributing
We welcome contributions from the community. If you would like to contribute to CitrineOS, please follow
our [contribution guidelines](https://github.com/citrineos/citrineos/blob/main/CONTRIBUTING.md).

## Licensing
CitrineOS and its subprojects are licensed under the Apache License, Version 2.0.

## Support and Contact
If you need help or want to report an issue:
- Open an issue on GitHub
- Reach out via the CitrineOS community channels