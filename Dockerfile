FROM refinedev/node:22
WORKDIR /app/refine
COPY . .
RUN npm i && npm run build
RUN npm install -g serve
WORKDIR /app/refine/dist
CMD ["serve", "-s"]
