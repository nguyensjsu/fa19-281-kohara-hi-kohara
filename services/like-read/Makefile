
all: clean

clean: 
	find . -name 'like-read' -type f -exec rm -f {} \; 
	go clean

go-get:
	rm -rf src/github.com
	go get -v github.com/codegangsta/negroni
	go get -v github.com/gorilla/mux
	go get -v github.com/unrolled/render
	go get -v github.com/satori/go.uuid
	go get gopkg.in/mgo.v2

format:
	go fmt like-read

install:
	go install like-read

build:
	go build like-read

start:
	./like-read 

test-ping:
	curl localhost:3000/ping

test-gumball:
	curl localhost:3000/like-read

docker-build: 
	docker build -t like-read .
	docker images

docker-run:
	docker run --name like-read -td -p 3000:3000 like-read
	docker ps

docker-network:
	docker network inspect host

docker-shell:
	docker exec -it like-read bash 

docker-clean:
	docker stop like-read
	docker rm like-read
	docker rmi like-read

docker-ip:
	docker-machine ip

heroku-tag:
	docker build -t like-read .
	docker tag like-read registry.heroku.com/pnguyen-goapi/web

heroku-push:
	heroku login 
	heroku container:login
	docker push registry.heroku.com/pnguyen-goapi/web

k-push:
	kubectl apply -f like-read-deployment.yaml
	kubectl apply -f like-read-service.yaml
