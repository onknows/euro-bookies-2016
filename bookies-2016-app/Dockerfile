# not an official repo, but seems legit
# depending on alpine-linux based layers vs makes the image 30MB instead of 660MB
FROM mhart/alpine-node:6

MAINTAINER Christophe Hesters <toefel18@gmail.com>

# working directory inside the image
WORKDIR /src

# copy the application files into the working directory
COPY server.js ./
COPY static ./static
COPY app ./app
COPY package.json ./

# install the dependencies and
RUN npm install --production

# docker build time arguments that are passed to nodejs so that the rest call to /version has meaningfull data
ARG software_version
ARG image_build_timestamp=2016-00-00T00:00:00Z
# expose the arguments as environment variables (these can be expanded by a shell, see CMD instruction below)
ENV software_version ${software_version:-0000000}
ENV image_build_timestamp ${image_build_timestamp:-2016-00-00T00:00:00Z}

# server.js runs on port 8080
EXPOSE 8080

# using exec makes supervisor the root process, this causes it to receive SIGTERM when docker stop is called and quit correctly
# supervisor restarts the script when it crashes, this is more robust than starting with `node server.js ...`
CMD exec node_modules/.bin/supervisor -- server.js 8080 "$software_version" "$image_build_timestamp"