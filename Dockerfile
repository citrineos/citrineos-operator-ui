FROM refinedev/node:18
COPY . .
RUN npm i && npm run build
RUN npm install -g serve
RUN cd ./dist
CMD ["serve"]
