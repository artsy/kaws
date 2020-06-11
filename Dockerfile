FROM node:12.18-alpine

# Set up deploy user and working directory
RUN adduser -D -g '' deploy
RUN mkdir -p /app
RUN chown deploy:deploy /app

# Set up dumb-init
ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_amd64 /usr/local/bin/dumb-init
RUN chown deploy:deploy /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

# Switch to deploy user
USER deploy
ENV USER deploy
ENV HOME /home/deploy

# Set up node_modules
WORKDIR /app
ADD package.json /app
ADD yarn.lock /app
RUN yarn install --frozen-lockfile && yarn cache clean

# Add the codebase
ADD --chown=deploy:deploy . /app

RUN yarn build

# Start the app
ENTRYPOINT ["/usr/local/bin/dumb-init", "--"]
CMD ["yarn", "start"]
