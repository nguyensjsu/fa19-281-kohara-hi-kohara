
all: clean

clean: 
	find . -name 'comment-read' -type f -exec rm -f {} \; 
	go clean

go-get:
	rm -rf src/github.com
	go get -v github.com/codegangsta/negroni
	go get -v github.com/gorilla/mux
	go get -v github.com/unrolled/render
	go get -v github.com/satori/go.uuid
	go get gopkg.in/mgo.v2

format:
	go fmt comment-read

install:
	go install comment-read

build:
	go build comment-read

start:
	./comment-read 

test-ping:
	curl localhost:3000/ping

test-gumball:
	curl localhost:3000/comment-read

docker-build: 
	docker build -t comment-read .
	docker images

docker-run:
	docker run --name comment-read -td -p 3000:3000 comment-read
	docker ps

docker-network:
	docker network inspect host

docker-shell:
	docker exec -it comment-read bash 

docker-clean:
	docker stop comment-read
	docker rm comment-read
	docker rmi comment-read

docker-ip:
	docker-machine ip

heroku-tag:
	docker build -t comment-read .
	docker tag comment-read registry.heroku.com/pnguyen-goapi/web

heroku-push:
	heroku login 
	heroku container:login
	docker push registry.heroku.com/pnguyen-goapi/web
