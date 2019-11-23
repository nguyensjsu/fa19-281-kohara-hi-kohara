
all: clean

clean: 
	find . -name 'like-write' -type f -exec rm -f {} \; 
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
	go fmt like-write

install:
	go install like-write

build:
	go build like-write

start:
	./like-write 

test-ping:
	curl localhost:3000/ping

test-gumball:
	curl localhost:3000/like-write

docker-build: 
	docker build -t like-write .
	docker images

docker-run:
	docker run --name like-write -td -p 3000:3000 like-write
	docker ps

docker-network:
	docker network inspect host

docker-shell:
	docker exec -it like-write bash 

docker-clean:
	docker stop like-write
	docker rm like-write
	docker rmi like-write

docker-ip:
	docker-machine ip

heroku-tag:
	docker build -t like-write .
	docker tag like-write registry.heroku.com/pnguyen-goapi/web

heroku-push:
	heroku login 
	heroku container:login
	docker push registry.heroku.com/pnguyen-goapi/web

k-push:
	kubectl apply -f like-write-deployment.yaml
	kubectl apply -f like-write-service.yaml

run:
	export GOPATH=$(pwd);export PATH=$PATH:$GOPATH/bin
	find . -name 'like-write' -type f -exec rm -f {} \; 
	go clean
	go install like-write
	go build like-write
	./like-write
