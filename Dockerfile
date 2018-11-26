FROM node:10.13.0

ADD . /app
WORKDIR /app

RUN rm -f /usr/local/bin/yarn && \
  curl -o- -L https://yarnpkg.com/install.sh | bash && \
  chmod +x ~/.yarn/bin/yarn && \
  ln -s ~/.yarn/bin/yarn /usr/local/bin/yarn
RUN yarn install
RUN yarn build

CMD yarn start