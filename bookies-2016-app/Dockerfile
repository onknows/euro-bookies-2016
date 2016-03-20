# not an official repo, but seems legit
# depending on alpine-linux based layers vs makes the image 30MB instead of 660MB
FROM mhart/alpine-node:base-4.3.2

MAINTAINER Christophe Hesters <toefel18@gmail.com>

# working directory inside the image
WORKDIR /src

# copy the application files into the working directory
COPY server.js ./
COPY app ./app
COPY node_modules ./node_modules

# TODO add build time args like git-commit-id + timestamp for tracability

# server.js runs on port 8088
EXPOSE 8088

# use exec, makes node the root process (so that it receives SIGNALS)
CMD exec node server.js