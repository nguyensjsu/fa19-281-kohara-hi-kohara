
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
	go fmt follow-read

install:
	go install follow-read

build:
	go build follow-read

start:
	./follow-read 

test-ping:
	curl localhost:3000/ping

test-follow-read:
	curl localhost:3000/follow-read

docker-build: 
	docker build -t follow-read .
	docker images

docker-run:
	docker run --name follow-read -td -p 3000:3000 follow-read
	docker ps

docker-network:
	docker network inspect host

docker-shell:
	docker exec -it follow-read bash 

docker-clean:
	docker stop follow-read
	docker rm follow-read
	docker rmi follow-read

docker-ip:
	docker-machine ip

heroku-tag:
	docker build -t follow-read .
	docker tag followpost registry.heroku.com/pnguyen-goapi/web

heroku-push:
	heroku login 
	heroku container:login
	docker push registry.heroku.com/pnguyen-goapi/web
