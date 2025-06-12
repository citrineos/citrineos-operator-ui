# SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
#
# SPDX-License-Identifier: Apache-2.0

FROM refinedev/node:22
WORKDIR /app/refine
COPY . .
RUN npm i && npm run build
RUN npm install -g serve
WORKDIR /app/refine/dist
CMD ["serve", "-s"]
