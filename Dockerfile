FROM node:7.7.2-wheezy

MAINTAINER Tomasz Netczuk

RUN npm i -g yarn@0.18.2
RUN npm cache clean
# fix for: .roadrunner.json error https://github.com/yarnpkg/yarn/issues/1724
RUN mkdir -p /root/.cache/yarn/
RUN yarn --version
