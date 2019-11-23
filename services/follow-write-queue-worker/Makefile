
all: clean

clean: 
	find . -name 'follow-write' -type f -exec rm -f {} \; 
	go clean

go-get:
	export GOPATH=$(pwd);export PATH=$PATH:$GOPATH/bin
	rm -rf src/github.com
	go get -v github.com/codegangsta/negroni
	go get -v github.com/gorilla/mux
	go get -v github.com/unrolled/render
	go get -v github.com/satori/go.uuid
	go get -v github.com/aws/aws-sdk-go/aws
	go get -v github.com/aws/aws-sdk-go/aws/awserr
	go get -v github.com/aws/aws-sdk-go/aws/session
	go get -v github.com/aws/aws-sdk-go/service/sqs
	go get gopkg.in/mgo.v2

format:
	go fmt follow-write

install:
	go install follow-write

build:
	go build follow-write

start:
	./follow-write 

test-ping:
	curl localhost:3000/ping

test-follow-write:
	curl localhost:3000/follow-write

docker-build: 
	docker build -t follow-write .
	docker images

docker-run:
	docker run --name follow-write -td -p 3000:3000 follow-write
	docker ps

docker-network:
	docker network inspect host

docker-shell:
	docker exec -it follow-write bash 

docker-clean:
	docker stop follow-write
	docker rm follow-write
	docker rmi follow-write

docker-ip:
	docker-machine ip

heroku-tag:
	docker build -t follow-write .
	docker tag follow-write registry.heroku.com/pnguyen-goapi/web

heroku-push:
	heroku login 
	heroku container:login
	docker push registry.heroku.com/pnguyen-goapi/web

run:
	export GOPATH=$(pwd);export PATH=$PATH:$GOPATH/bin
	find . -name 'follow-write' -type f -exec rm -f {} \; 
	go clean
	go install follow-write
	go build follow-write
	./follow-write
