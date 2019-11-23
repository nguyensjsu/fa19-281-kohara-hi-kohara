
all: clean

clean: 
	find . -name 'signup' -type f -exec rm -f {} \; 
	go clean

go-get:
	rm -rf src/github.com
	go get -v github.com/codegangsta/negroni
	go get -v github.com/gorilla/mux
	go get -v github.com/unrolled/render
	go get -v github.com/satori/go.uuid
	go get gopkg.in/mgo.v2

format:
	go fmt signup

install:
	go install signup

build:
	go build signup

start:
	./signup 

rerun: build start

test-ping:
	curl localhost:3000/ping

test-gumball:
	curl localhost:3000/signup

docker-build: 
	docker build -t signup .
	docker images

docker-run:
	docker run --name signup -td -p 3000:3000 signup
	docker ps

docker-network:
	docker network inspect host

docker-shell:
	docker exec -it signup bash 

docker-clean:
	docker stop signup
	docker rm signup
	docker rmi signup

docker-ip:
	docker-machine ip

heroku-tag:
	docker build -t signup .
	docker tag signup registry.heroku.com/pnguyen-goapi/web

heroku-push:
	heroku login 
	heroku container:login
	docker push registry.heroku.com/pnguyen-goapi/web

k-push:
	kubectl apply -f signup-deployment.yaml
	kubectl apply -f signup-service.yaml

k-clear:
	kubectl delete pod --all
	kubectl delete svc --all
	kubectl delete deployment --all

k-getall:
	kubectl get pod
	kubectl get svc
	kubectl get deployment