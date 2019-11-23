# Project Title: Instagram App

## Team members: 

- [Arkil Thakkar](https://github.com/arkil) (013825292) <br />
- [Saket Thakre](https://github.com/saketthakare) (012440974) <br />
- [Varun Jain](https://github.com/thevarunjain) (013719108)  <br />
- [Varun Shrivastav](https://github.com/svarun1307) (011438531)  <br />
- [Vishwanath Manvi](https://github.com/vishumanvi) (013776204)  <br />

## Project Summary:
The project implements a prototype of Instragram app. Instagram is a popular photo sharing social networking site where users can post pictures and like or comment on them. 

Below are the core functionalities of our implementation of Instagram <br/>

1. New users can signup <br/>
2. Login <br/>
3. Submit a picture as a post <br/>
4. Like a post <br/>
5. Comment a post <br/>
6. Follow a user <br/>
7. View timeline with all posts of people you follow <br/>
8. Notification <br/>


### Project Architecture: <br/>
Below is the high level architecture of our implementation of Instagram app.

![Architecture](https://github.com/nguyensjsu/fa19-281-kohara-hi-kohara/blob/master/Screenshots/Architecture%20DIagram.png)

Users connect to app using a browser. The browser connects to the React frontend app which is running on GCP through a load balancer. The react app runs on a 3 node GKE Kubernetes cluster that can be auto scaled.

The React frontend app connects to backend deployed on AWS through API gateway. The API gateway has 5 routes, one for each of the microservices deployed on individual VPCs per requirement. Route 53 is used to resolve the load balancers fronting the microservices to keep it static and avoid multiple config changes.

Each of the microservices is deployed in a seperate Kubernetes cluster managed through EKS. They also have their own NoSQL cluster present in their VPC. All services except Timeline use MongoDB cluster. Timeline service uses Riak cluster for its caching needs. MongoDB is sharded into 2 shards based on username hash. 

All VPCs are connected through VPC peering to communicate with each other without having to route through API gateway and thereby reducing latencies. 

## Key Cloud Features implemented
1. [Microservices with auto-scaling deployed using Kubernetes on EKS cluster](https://github.com/nguyensjsu/fa19-281-kohara-hi-kohara/blob/master/eks/README.md)
  Each of the microservices deployed in EKS clusters of specific VPCs with auto-scaling enabled to provide high availability and reliable services that can scale per demand
  
2. [MongoDB sharding](https://github.com/nguyensjsu/fa19-281-kohara-hi-kohara/blob/master/Mongo-Sharding/Sharding%20Instructions.md)
    Sharding implemented on MongoDB that's the primary datastore for most services. Sharding enables database clusters to scale in the z-axis of AFK scale. We implemented 7 mongo DB nodes (2 config node cluster, 2 shard clusters with a replica set in each along with a query server for clients to connect).
    
3. [VPC Peering to create service mesh](https://github.com/nguyensjsu/fa19-281-kohara-hi-kohara/blob/master/docs/1.%20VPN%20Peering%20Instructions.md)
  VPC peering used to connect individual VPCs into a common mesh for backend services to integrate seamlesly without going through external load balancers or API gateway. This also ensure higher throughput and lower latencies.
  
4. AWS API gateway for client auth <br/>
  Clients (e.g: React App) connect to backend services through AWS API gateway. A route is created for each of the microservice that client can use to work with.
  
5. [Event sourcing using AWS SQS for CQRS](https://github.com/nguyensjsu/fa19-281-kohara-hi-kohara/tree/master/SQS) <br/>
  Created Read and Write diffrent services, worker thread having integration with sqs queue pulls the message written to write services 

6. CloudFront CDN for images <br/>
 Store posted images on S3 and used Cloudfront  CDN to retrieve images faster 

7. [Intercloud interaction (GCP + AWS)](https://github.com/nguyensjsu/fa19-281-kohara-hi-kohara/tree/master/kubernetes)<br/>
Deployed Frontend on GCP using GKE and Backend on AWS using EKS

8. Continous Integration and Continous Delivery for Frontend app in GCP 
  Used Github actions to setup CI/CD so that once frontend code is pushed to git, a container build is created and deployed to GKE cluster immediately 

9. Continuous Integration for Microservices using **Github Actions <br/>
  Used Github actions to setup CI so that once microservices code is pushed to git, a container build is created and deployed to dockerhub immediately.
  
10. [Firebase authentication](https://github.com/nguyensjsu/fa19-281-kohara-hi-kohara/blob/master/Firebase/Readme.md) <br/>
    When a user login into app his credentials are authenticated using firebase service
    
11. [Route 53](https://github.com/nguyensjsu/fa19-281-kohara-hi-kohara/tree/master/Route53) pointing to Kubernetes Load balancers <br/>
    Used Route53 to resolve the load balancers fronting the microservices to keep it static and avoid multiple config changes.

12. [Swagger Mockups during development](https://app.swaggerhub.com/apis-docs/saketthakare/instagram-cmpe281/1)
    Used Swagger before dev started to establish API contracts and setup the mocks to unblock development.

13. OneSignal Push Notification service [OneSignal] (https://onesignal.com/): Using the OneSignalSDK, we trigger web push notifications when a user posts a new image.


Project Management:

Used Git Project Dashboard to manage tasks.

![alt text](https://github.com/nguyensjsu/fa19-281-kohara-hi-kohara/blob/master/docs/gitproject.png "Project Dashboard")

Followed Agile practise using GitHub Issue board 

![Issue](https://user-images.githubusercontent.com/42597460/69481994-e2550900-0dca-11ea-96ec-b38550d0a927.png)

Try the app at:

http://landkarade.team/


