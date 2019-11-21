
all: clean

clean: 
	find . -name 'post-read' -type f -exec rm -f {} \; 
	go clean

go-get:
	rm -rf src/github.com
	go get -v github.com/codegangsta/negroni
	go get -v github.com/gorilla/mux
	go get -v github.com/unrolled/render
	go get -v github.com/satori/go.uuid
	go get gopkg.in/mgo.v2

format:
	go fmt post-read

install:
	go install post-read

build:
	go build post-read

start:
	./post-read 

test-ping:
	curl localhost:3000/ping

test-gumball:
	curl localhost:3000/post-read

docker-build: 
	docker build -t post-read .
	docker images

docker-run:
	docker run --name post-read -td -p 3000:3000 post-read
	docker ps

docker-network:
	docker network inspect host

docker-shell:
	docker exec -it post-read bash 

docker-clean:
	docker stop post-read
	docker rm post-read
	docker rmi post-read

docker-ip:
	docker-machine ip

heroku-tag:
	docker build -t post-read .
	docker tag post-read registry.heroku.com/pnguyen-goapi/web

heroku-push:
	heroku login 
	heroku container:login
	docker push registry.heroku.com/pnguyen-goapi/web

k-push:
	kubectl apply -f post-read-deployment.yaml
	kubectl apply -f post-read-service.yaml
