# CMPE 281

# Deploy on Kubernetes

## Normal objects

### Build docker image
```
docker build --tag frontend:latest .
```

#### Deploy with native `kubectl` commands
```
kubectl apply -f kubernetes/config-dev.yaml # creates the configMap in the Kubernetes cluster
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml
```

** Undo deployments ** 

```
kubectl delete configMap frontend-config
kubectl delete deployment frontend
kubectl delete service frontend
```

Forward port 

```
kubectl port-forward svc/frontend 3001:80
```

Then access the app at [http://localhost:3001](http://localhost:3001)

## Deploy with [helm](https://helm.sh/)

### Create release
```
helm upgrade dev-release ./helm-chart/ --install --force --values helm-chart/config-values/config-dev.yaml
helm ls #verify dev-release is present
```


### Undo release

```
helm delete --purge dev-release
```

## Deploy with [kustomize](https://kustomize.io/)

Build with kustomize to see what Kubernetes objects are generated
```
kustomize build kustomize/base/
```

Apply base
```
kubectl apply -k kustomize/base
```

Undo
```
kubectl delete -k kustomize/base
```

Apply DEV overlay
```
kubectl apply -k kustomize/overlays/dev
```

Undo
```
kubectl delete -k kustomize/overlays/dev
```

## Cherry on the cake - use [skaffold](https://skaffold.dev/)

> We will use [skaffold profiles](https://skaffold.dev/docs/how-tos/profiles/)

### Deploy via kubectl 
```
skaffold run -p native-kubernetes
```

```
skaffold delete -p native-kubernetes
```


### Deploy via kustomize

For example build the prod thing:
```
skaffold run -p kustomize-prod
```

```
skaffold delete -p kustomize-prod
```
