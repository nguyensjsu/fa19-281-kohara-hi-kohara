FROM golang:latest 
EXPOSE 3000
RUN mkdir /app 
ADD . /app/ 
WORKDIR /app 
ENV GOPATH /app
ENV PORT 3000
ENV MONGO mongodb://admin:admin@10.3.1.166:27017/?authSource=admin
RUN cd /app ; go install follow-read
CMD ["/app/bin/follow-read"]
