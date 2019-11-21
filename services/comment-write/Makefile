
all: clean

clean: 
	find . -name 'comment-write' -type f -exec rm -f {} \; 
	go clean

go-get:
	rm -rf src/github.com
	go get -v github.com/codegangsta/negroni
	go get -v github.com/gorilla/mux
	go get -v github.com/unrolled/render
	go get -v github.com/satori/go.uuid
	go get gopkg.in/mgo.v2

format:
	go fmt comment-write

install:
	go install comment-write

build:
	go build comment-write

start:
	./comment-write 

test-ping:
	curl localhost:3000/ping

test-gumball:
	curl localhost:3000/comment-write

docker-build: 
	docker build -t comment-write .
	docker images

docker-run:
	docker run --name comment-write -td -p 3000:3000 comment-write
	docker ps

docker-network:
	docker network inspect host

docker-shell:
	docker exec -it comment-write bash 

docker-clean:
	docker stop comment-write
	docker rm comment-write
	docker rmi comment-write

docker-ip:
	docker-machine ip

heroku-tag:
	docker build -t comment-write .
	docker tag comment-write registry.heroku.com/pnguyen-goapi/web

heroku-push:
	heroku login 
	heroku container:login
	docker push registry.heroku.com/pnguyen-goapi/web

k-push:
	kubectl apply -f comment-write-deployment.yaml
	kubectl apply -f comment-write-service.yaml
