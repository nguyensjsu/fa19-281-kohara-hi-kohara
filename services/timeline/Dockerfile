FROM golang:latest 
EXPOSE 3000
RUN mkdir /app 
ADD . /app/ 
WORKDIR /app 
ENV GOPATH /app
RUN cd /app ;
RUN export GOPATH=$(pwd);export PATH=$PATH:$GOPATH/bin
RUN go get -v github.com/codegangsta/negroni
RUN go get -v github.com/gorilla/mux
RUN go get -v github.com/unrolled/render
RUN go get -v github.com/satori/go.uuid
RUN go get -v database/sql
RUN go get -v github.com/go-sql-driver/mysql
RUN go get -v github.com/nitishm/go-rejson
RUN go get -v github.com/go-redis/redis
RUN go get -v github.com/KromDaniel/rejonson
RUN go install timeline
CMD ["/app/bin/timeline"]
