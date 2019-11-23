# Instructions on setting up MongoDb Sharding


1) Create 7 Instances with Mongo installed


sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4 <br />
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/4.0 multiverse" | sudo t
ee /etc/apt/sources.list.d/mongodb.list
sudo apt update <br />
sudo apt install mongodb-org <br />

openssl rand -base64 741 > keyFile <br />
sudo mkdir -p /opt/mongodb <br />
sudo cp keyFile /opt/mongodb <br />
sudo chown mongodb:mongodb /opt/mongodb/keyFile <br />
sudo chmod 0600 /opt/mongodb/keyFile <br />

Create mongod.service

sudo vi /etc/systemd/system/mongod.service

[Unit] <br />
	Description=High-performance, schema-free document-oriented database <br />
	After=network.target <br />
[Service] <br />
	User=mongodb <br />
	ExecStart=/usr/bin/mongod --quiet --config /etc/mongod.conf <br />
[Install] <br />
	WantedBy=multi-user.target <br />


sudo systemctl enable mongod.service <br />
sudo service mongod restart <br />
sudo service mongod status <br />


2)  Modify /etc/hosts of all the nodes

Add private ip and name

10.3.1.162 configsvr1 <br />
10.3.1.186 configsvr2 <br />
10.3.1.178 shardsvr1 <br />
10.3.1.251 shardsvr2 <br />
10.3.1.126 shardsvr3 <br />
10.3.1.23 shardsvr4 <br />
10.3.1.130 mongos <br />


3 ) Setup 2 clusters as Config Server.

Modify /etc/mongod.conf

net: <br />
  port: 27018 <br />
  bindIp: 0.0.0.0 <br />

replication: <br />
   replSetName: "replconfig01" <br />

sharding: <br />
   clusterRole: configsvr <br />

security: <br />
   keyFile: /opt/mongodb/keyFile <br />


4) Login in to ConfigServer and initiate replica set
 
 rs.initiate(
  {
    _id: "replconfig01",
    configsvr: true,
    members: [
      { _id : 0, host : "configsvr1:27018" },
      { _id : 1, host : "configsvr2:27018" }
    ]
  }
)  


5) Create 2 Shards having  2 Replica Set


Shard1:(In both Nodes)

Modify  /etc/mongod.conf

net: <br />
  port: 27017 <br />
  bindIp: 0.0.0.0 <br />

replication: <br />
   replSetName: "shardreplica01" <br />

sharding: <br />
   clusterRole: shardsvr <br />


 Login in to Shard Server and initiate replica set
 
 rs.initiate(
   {
     _id : "shardreplica01",
     members: [
       { _id : 0, host : "shardsvr1:27017" },
       { _id : 1, host : "shardsvr2:27017" }
     ]
   }
 )



Shard2:(In both Node)



Modify  /etc/mongod.conf


net: <br />
  port: 27018 <br />
  bindIp: 0.0.0.0 <br />

replication: <br />
   replSetName: "shardreplica02" <br />

sharding: <br />
   clusterRole: shardsvr <br />

Login in to Shard Server and initiate replica set
 
 rs.initiate(
   {
     _id : "shardreplica02",
     members: [
       { _id : 0, host : "shardsvr3:27017" },
       { _id : 1, host : "shardsvr4:27017" }
     ]
   }
 )


6) Create Mongo Query Writer


Modify  /etc/mongod.conf


net: <br />
  port: 27019 <br />
  bindIp: 0.0.0.0 <br />

 To start cmd line mongo<br />
 mongos --configdb "replconfig01/configsvr1:27018,configsvr2:27018"


In Mongo Shell:

 sh.addShard( "shardreplica01/shardsvr1:27017") <br />
 sh.addShard( "shardreplica01/shardsvr2:27017") <br />


 sh.addShard( "shardreplica02/shardsvr3:27017") <br />
 sh.addShard( "shardreplica02/shardsvr4:27017") <br />

 sh.status() <br />

 use follow; <br />
 sh.enableSharding("follow") <br />
 sh.shardCollection("follow.follow", { "follower" : "hashed" } ) <br />





