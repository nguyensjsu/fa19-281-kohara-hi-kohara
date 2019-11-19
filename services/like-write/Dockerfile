FROM golang:latest 
EXPOSE 3000
RUN mkdir /app 
ADD . /app/ 
WORKDIR /app 
ENV GOPATH /app
ENV PORT 3000
ENV MONGO mongodb://admin:admin@10.4.1.57:27017/?authSource=admin
RUN cd /app ; go install like-write
CMD ["/app/bin/like-write"]