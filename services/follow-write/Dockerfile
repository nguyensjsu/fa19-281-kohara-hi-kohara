FROM golang:latest 
EXPOSE 3000
RUN mkdir /app 
ADD . /app/ 
WORKDIR /app 
ENV GOPATH /app
ENV PORT 80
ENV MONGO mongodb://admin:admin@10.4.1.57:27017/?authSource=admin
RUN cd /app ; go install follow-write
CMD ["/app/bin/follow-write"]
