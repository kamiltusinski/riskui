FROM node:10.6.0

RUN mkdir -p /srv/src/risk-client
WORKDIR /srv/src/risk-client

ENV PATH /srv/src/risk-client/node_modules/.bin:$PATH

COPY package.json /srv/src/risk-client
COPY package-lock.json /srv/src/risk-client

RUN npm install
RUN npm install react-scripts -g

COPY . /srv/src/risk-client

EXPOSE 3000
CMD ["npm","start"]

