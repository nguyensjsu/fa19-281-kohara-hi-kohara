
all: clean

clean: 
	find . -name 'login' -type f -exec rm -f {} \; 
	go clean

go-get:
	rm -rf src/github.com
	go get -v github.com/codegangsta/negroni
	go get -v github.com/gorilla/mux
	go get -v github.com/unrolled/render
	go get -v github.com/satori/go.uuid
	go get gopkg.in/mgo.v2

format:
	go fmt login

install:
	go install login

build:
	go build login

start:
	./login 

rerun: build start

test-ping:
	curl localhost:3000/ping

test-gumball:
	curl localhost:3000/login

docker-build: 
	docker build -t login .
	docker images

docker-run:
	docker run --name login -td -p 3000:3000 login
	docker ps

docker-network:
	docker network inspect host

docker-shell:
	docker exec -it login bash 

docker-clean:
	docker stop login
	docker rm login
	docker rmi login

docker-ip:
	docker-machine ip

heroku-tag:
	docker build -t login .
	docker tag login registry.heroku.com/pnguyen-goapi/web

heroku-push:
	heroku login 
	heroku container:login
	docker push registry.heroku.com/pnguyen-goapi/web
