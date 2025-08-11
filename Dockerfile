# SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
#
# SPDX-License-Identifier: Apache-2.0

FROM refinedev/node:22

WORKDIR /app/refine

# Accept build-time variables from Railway (add any extra VITE_* keys you use)
ARG VITE_ADMIN_EMAIL
ARG VITE_ADMIN_PASSWORD
ARG VITE_API_URL
ARG VITE_WS_URL
ARG VITE_CITRINE_CORE_URL
ARG VITE_HASURA_ADMIN_SECRET
ARG VITE_FILE_SERVER_URL
ARG VITE_LOGO_URL
ARG VITE_METRICS_URL
ARG VITE_GOOGLE_MAPS_API_KEY
ARG VITE_TENANT_ID

# Make them available to the Vite build
ENV VITE_ADMIN_EMAIL=${VITE_ADMIN_EMAIL}
ENV VITE_ADMIN_PASSWORD=${VITE_ADMIN_PASSWORD}
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_WS_URL=${VITE_WS_URL}
ENV VITE_CITRINE_CORE_URL=${VITE_CITRINE_CORE_URL}
ENV VITE_HASURA_ADMIN_SECRET=${VITE_HASURA_ADMIN_SECRET}
ENV VITE_FILE_SERVER_URL=${VITE_FILE_SERVER_URL}
ENV VITE_LOGO_URL=${VITE_LOGO_URL}
ENV VITE_METRICS_URL=${VITE_METRICS_URL}
ENV VITE_GOOGLE_MAPS_API_KEY=${VITE_GOOGLE_MAPS_API_KEY}
ENV VITE_TENANT_ID=${VITE_TENANT_ID}

COPY . .

# Optional: also emit a .env.production so tools that read files can see the same values
# (Vite already reads process env; this is just a convenience)
RUN printenv | grep '^VITE_' > .env.production || true

RUN npm i && npm run build

RUN npm install -g serve
WORKDIR /app/refine/dist

CMD ["serve", "-s"]

