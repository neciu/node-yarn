FROM node:6.10.0-alpine

MAINTAINER Tomasz Netczuk

RUN npm i -g yarn@0.17.10
RUN npm cache clean
# fix for: .roadrunner.json error https://github.com/yarnpkg/yarn/issues/1724
RUN mkdir -p /root/.cache/yarn/
RUN yarn --version
