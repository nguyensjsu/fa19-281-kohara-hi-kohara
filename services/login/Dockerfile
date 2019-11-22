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
RUN go get gopkg.in/mgo.v2
RUN go install login
CMD ["/app/bin/login"]
