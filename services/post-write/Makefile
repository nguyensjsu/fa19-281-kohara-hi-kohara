
all: clean

clean: 
	find . -name 'post-write' -type f -exec rm -f {} \; 
	go clean

go-get:
	rm -rf src/github.com
	go get -v github.com/codegangsta/negroni
	go get -v github.com/gorilla/mux
	go get -v github.com/unrolled/render
	go get -v github.com/satori/go.uuid
	go get gopkg.in/mgo.v2

format:
	go fmt post-write

install:
	go install post-write

build:
	go build post-write

start:
	./post-write 

test-ping:
	curl localhost:3000/ping

test-gumball:
	curl localhost:3000/post-write

docker-build: 
	docker build -t post-write .
	docker images

docker-run:
	docker run --name post-write -td -p 3000:3000 post-write
	docker ps

docker-network:
	docker network inspect host

docker-shell:
	docker exec -it post-write bash 

docker-clean:
	docker stop post-write
	docker rm post-write
	docker rmi post-write

docker-ip:
	docker-machine ip

heroku-tag:
	docker build -t post-write .
	docker tag post-write registry.heroku.com/pnguyen-goapi/web

heroku-push:
	heroku login 
	heroku container:login
	docker push registry.heroku.com/pnguyen-goapi/web

k-push:
	kubectl apply -f post-write-deployment.yaml
	kubectl apply -f post-write-service.yaml
