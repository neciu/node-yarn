FROM node:7.1.0-wheezy

MAINTAINER Tomasz Netczuk

RUN npm i -g yarn@0.17.2
RUN npm cache clean
# fix for: .roadrunner.json error https://github.com/yarnpkg/yarn/issues/1724
RUN mkdir -p /root/.cache/yarn/
RUN yarn --version
