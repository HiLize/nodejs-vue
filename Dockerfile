FROM 172.16.9.100:5000/alpine-node:1.0.0

ARG PROFILE

ADD . /app

RUN cd /app/aqserver && npm install --registry=https://registry.npm.taobao.org

WORKDIR /app/aqserver
CMD npm start
