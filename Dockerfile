# fetch the latest node image from alpine
FROM node:alpine AS builder

# work directory
WORKDIR /react-app

# copy package.json and package-lock.json
COPY package*.json ./

# install dependencies
RUN npm install
RUN npm install

# copy all the files in our project
COPY . .

# build the project
RUN npm run build

# # fetch the latest nginx image
# FROM nginx:alpine

# # copy the build folder from react to the nginx folder
# COPY --from=builder /react-app/build /usr/share/nginx/html

# # copy the nginx configuration file
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 3000

CMD [ "npm", "start" ]