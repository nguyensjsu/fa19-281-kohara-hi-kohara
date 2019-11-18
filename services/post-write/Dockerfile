FROM golang:latest 
EXPOSE 3000
RUN mkdir /app 
ADD . /app/ 
WORKDIR /app 
ENV GOPATH /app
RUN cd /app ; go install post-write
CMD ["/app/bin/post-write"]
