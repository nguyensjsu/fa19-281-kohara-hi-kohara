# Project Title: Instagram App

## Team members: 
Arkhil Thakkar (013825292) <br />
Saket Thakre ( ) <br />
Varun Jain (013719108) <br />
Varun Shrivastav ( ) <br />
Vishwanath Manvi (013776204) <br />

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
8. Notification  (TBD: Add specifics) <br/>


### Project Architecture: <br/>
Below is the high level architecture of our implementation of Instagram app.



## Key Cloud Features implemented
1. [Microservices with auto-scaling deployed using Kubernetes on EKS cluster](https://github.com/nguyensjsu/fa19-281-kohara-hi-kohara/blob/master/eks/README.md)
  Each of the microservices deployed in EKS clusters of specific VPCs with auto-scaling enabled to provide high availability and reliable services that can scale per demand
2. [MongoDB sharding](https://github.com/nguyensjsu/fa19-281-kohara-hi-kohara/blob/master/Mongo-Sharding/Sharding%20Instructions.md)
    Sharding implemented on MongoDB that's the primary datastore for most services. Sharding enables database clusters to scale in the z-axis of AFK scale. We implemented 7 mongo DB nodes (2 config node cluster, 2 shard clusters with a replica set in each along with a query server for clients to connect).
    
3. [VPC Peering to create service mesh](https://github.com/nguyensjsu/fa19-281-kohara-hi-kohara/blob/master/docs/1.%20VPN%20Peering%20Instructions.md)
  VPC peering used to connect individual VPCs into a common mesh for backend services to integrate seamlesly without going through external load balancers or API gateway. This also ensure higher throughput and lower latencies.
  
4. AWS API gateway for client auth <br/>
  Clients (e.g: React App) connect to backend services through AWS API gateway. A route is created for each of the microservice that client can use to work with.
  
5. Event sourcing using AWS SQS for CQRS <br/>
  Created Read and Write diffrent services, worker thread having integration with sqs queue pulls the message written to write services 

6. CloudFront CDN for images <br/>
  Using Cloud Front 

7. Intercloud interaction (GCP + AWS)

8. Continous Integration and Continous Delivery for Frontend app in GCP

9. Continuous Integration for Microservices using Github Actions

10. Firebase authentication

11. Route 53 pointing to Kubernetes Load balancers

12. [Swagger Mockups during development](https://app.swaggerhub.com/apis-docs/saketthakare/instagram-cmpe281/1)


Project Management:
Used Git Project Dashboard to manage tasks.
![alt text](https://github.com/nguyensjsu/fa19-281-kohara-hi-kohara/blob/master/docs/gitproject.png "Project Dashboard")


Try the app at:

http://landkarade.team/


