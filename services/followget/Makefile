
all: clean

clean: 
	find . -name 'gumball' -type f -exec rm -f {} \; 
	go clean

go-get:
	rm -rf src/github.com
	go get -v github.com/codegangsta/negroni
	go get -v github.com/gorilla/mux
	go get -v github.com/unrolled/render
	go get -v github.com/satori/go.uuid

format:
	go fmt followget

install:
	go install followget

build:
	go build followget

start:
	./followget 

test-ping:
	curl localhost:3000/ping

test-gumball:
	curl localhost:3000/followget

docker-build: 
	docker build -t followget .
	docker images

docker-run:
	docker run --name followget -td -p 3000:3000 followget
	docker ps

docker-network:
	docker network inspect host

docker-shell:
	docker exec -it followget bash 

docker-clean:
	docker stop followget
	docker rm followget
	docker rmi followget

docker-ip:
	docker-machine ip

heroku-tag:
	docker build -t followget .
	docker tag followpost registry.heroku.com/pnguyen-goapi/web

heroku-push:
	heroku login 
	heroku container:login
	docker push registry.heroku.com/pnguyen-goapi/web
