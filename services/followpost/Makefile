
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
	go fmt followpost

install:
	go install followpost

build:
	go build followpost

start:
	./followpost 

test-ping:
	curl localhost:3000/ping

test-gumball:
	curl localhost:3000/followpost

docker-build: 
	docker build -t followpost .
	docker images

docker-run:
	docker run --name followpost -td -p 3000:3000 followpost
	docker ps

docker-network:
	docker network inspect host

docker-shell:
	docker exec -it followpost bash 

docker-clean:
	docker stop followpost
	docker rm followpost
	docker rmi followpost

docker-ip:
	docker-machine ip

heroku-tag:
	docker build -t followpost .
	docker tag followpost registry.heroku.com/pnguyen-goapi/web

heroku-push:
	heroku login 
	heroku container:login
	docker push registry.heroku.com/pnguyen-goapi/web
