# Amazon EKS Cluster

We will be deploying all the services in a managed Kubernetes cluster.

## EKS Setup

### Create User for AWS CLI and Console

Create a new IAM user to get the access keys and secret access token to be used in AWS CLI
![](eks-01-create-new-iam-user.png)

Select 'Attach existing policiy directly' and mark AdministratorAccess
![](eks-02-attach-existing-policy.png)

Review settings and Create User
![](eks-03-create-user.png)

Note the sign-in URL along with Access key ID and Secret access key 
![](eks-04-url-key.png)

Login to the sign-in URL
![](eks-05-login.png)

### Create IAM Role for EKS service

Open IAM Roles at https://console.aws.amazon.com/iam/home?region=us-east-1#/roles
![](eks-06-roles.png)

Choose EKS
![](eks-07-eks-roles.png)

Review the information and create role.
![](eks-08-review.png)

### Update existing VPC for EKS

Create VPC with 2 Private and 2 Public subnet.
![](eks-09-vpc.png)

Open the Subnets and Add new tag for both the private subnets.
![](eks-10-add-tag.png)

### Install and Configure kubectl for Amazon EKS

Install aws-cli

Refer
- https://docs.aws.amazon.com/cli/latest/userguide/install-macos.html

- https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html

![](eks-11-aws-cli.png)

Install kubectl

Refer
- https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html

![](eks-12-kubectl.png)


### Create Amazon EKS Cluster

Click Create Cluster on Amazon EKS console at https://console.aws.amazon.com/eks/home#/clusters.

Cluster Name : Name based on the services to be deployed.

Role Name: Select the IAM role we created in previous steps.

VPC: Select the VPC created with all the 4 subnets.

![](eks-13-create-cluster.png)

Click 'Create'. Takes around 15min to create.

![](eks-14-eks-creation.png)

### Create a kubeconfig File

Update kubeconfig

`aws eks --region us-east-1 update-kubeconfig --name post-cluster`

output should look similar to below.

```
NAME             TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   10.100.0.1   <none>        443/TCP   1m
```

### Managed Node Group

We need a worker node IAM role.

- https://console.aws.amazon.com/cloudformation

- Create stack with new resources

- Default setting. Enter `https://amazon-eks.s3-us-west-2.amazonaws.com/cloudformation/2019-11-15/amazon-eks-nodegroup-role.yaml` in Amazon S3 URL


![](eks-15-create-stack.png)

Give stack name `eks-node-group-instance-role`
Review and create stack

![](eks-16-stack-name.png)

Wait. After some time, check the Outputs and get the NodeInstanceRole value.

![](eks-17-stacks-output.png)

Back in EKS Cluster click on `Add node group`. Give name and select the newly created node instance role.

![](eks-18-configure-node-group.png)

Select compute config shown in below image.

![](eks-19-compute-config.png)

Min, Max, Desired size should be 2,4 and 2 resp.

![](eks-20-scaling.png)

Review and Create.

![](eks-21-node-group-in-progress.png)

## Deployment

Easy way to deploy application on Cluster would be to build a docker image. Then use `kubectl create deployment`.

Eg.
`kubectl create deployment post-write-service --image=saketthakare/post-write:v1
kubectl get pods
kubectl expose deployment post-write-service --type=LoadBalancer --port 80 --target-port 3000`

A Kubernetes service is a named load balancer that proxies traffic to one or more pods. We create a loadbalancer.

`kubectl expose deployment post-write-service --type=LoadBalancer --port 80 --target-port 3000`

Additional: kubernetes dasboard can also be deployed locally. Refer.
- https://docs.aws.amazon.com/eks/latest/userguide/dashboard-tutorial.html

![](eks-22-kubernetes-dashboard.png)