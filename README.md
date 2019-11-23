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
2. MongoDB sharding
3. [VPC Peering to create service mesh](https://github.com/nguyensjsu/fa19-281-kohara-hi-kohara/blob/master/docs/1.%20VPN%20Peering%20Instructions.md)
4. AWS API gateway for client auth
5. Event sourcing using AWS SQS for CRQS
6. CloudFront CDN for images
7. Intercloud interaction (GCP + AWS)
8. Continous Integration and Continous Delivery for Frontend app in GCP
9. Continuous Integration for Microservices using Github Actions
10. Firebase authentication
11. Route 53 pointing to Kubernetes Load balancers
