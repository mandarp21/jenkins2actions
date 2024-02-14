#Define the image we want to build from
FROM node:14.15.3-alpine

#Copy the current directory to a newly created working directory
COPY . /code

#Define the working directory - Change this to the directory your Node app is defined in
#WORKDIR /code

#Install all the node dependencies
#RUN npm install && \
#		npm install -g @angular/cli && \
#		ng build --base-href /frontend-engineeringportal --configuration=production --aot=false #--build-optimizer=false --deploy-url /
#		ng build --base-href /frontend-engineeringportal/ --configuration=mock

WORKDIR /code/server

#Install all the node dependencies
#RUN npm install

#Define all environment variables. Here, we're defining the PORT environment variable
ENV PORT=3021

#Define mongo domain if applicable
#ENV MONGO_URI = mongo

#use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3021

# Run application
CMD [ "npm", "start"]
