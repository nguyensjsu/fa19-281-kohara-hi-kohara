/*
	Follow Post Microservice
*/

package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"

	"net/http"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"github.com/codegangsta/negroni"
	"github.com/gorilla/mux"
	"github.com/unrolled/render"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/sqs"
)

// MongoDB Config
var mongodbServer = "mongodb://admin:admin@10.3.1.178:27017,10.3.1.126:27017/?authSource=admin"
var mongodbDatabase = "follow"
var mongodbCollection = "follow"
var queue_name = "pair-upar-kar"

// NewServer configures and returns a Server.
func NewServer() *negroni.Negroni {
	formatter := render.New(render.Options{
		IndentJSON: true,
	})
	n := negroni.Classic()
	mx := mux.NewRouter()
	initRoutes(mx, formatter)
	n.UseHandler(mx)
	if len(os.Getenv("MONGO")) == 0 {
		mongodbServer = os.Getenv("MONGO")
	}

	fmt.Println("QUEUE INIT")
	initQueue()

	return n
}

// API Routes
func initRoutes(mx *mux.Router, formatter *render.Render) {
	mx.HandleFunc("/ping", pingHandler(formatter)).Methods("GET")
	mx.HandleFunc("/follow/{id}", addNewFriendHandler(formatter)).Methods("POST")

}

// API Ping Handler
func pingHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		formatter.JSON(w, http.StatusOK, struct{ Test string }{"Follow Post API alive!"})
	}
}

// API to add a new friend in folllow list
func addNewFriendHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {

		session, err := mgo.Dial(mongodbServer)
		if err != nil {
			panic(err)
		}
		defer session.Close()
		session.SetMode(mgo.Monotonic, true)
		c := session.DB(mongodbDatabase).C(mongodbCollection)

		params := mux.Vars(req)
		fmt.Println("params:", params)
		userID := params["id"]
		fmt.Println("user: ", userID)
		var follwerReq follow
		_ = json.NewDecoder(req.Body).Decode(&follwerReq)
		fmt.Println("Follow Req of friend: ", follwerReq.UserID)

		//fmt.Println("newFollower: ", newFollower)
		if followersMap == nil {
			followersMap = make(map[string][]string)
		}

		followersArray, ok := followersMap[userID]
		isFollowerAdded := stringInSlice(follwerReq.UserID, followersArray)
		fmt.Println("Before Follower Map: ", followersMap)
		fmt.Println("Before Follower Array: ", followersArray)

		if ok {
			fmt.Println("followers:", followersMap)
			//var followerArray []string = followersMap[userID]
			fmt.Println("user: ", userID)

			if isFollowerAdded == false {
				followersArray = append(followersArray, follwerReq.UserID)
				followersMap[userID] = followersArray
				fmt.Println("followerArray:", followersArray)
			}
			fmt.Println("Key added: ", follwerReq.UserID)
		} else {

			if isFollowerAdded == false {
				followersArray = append(followersArray, follwerReq.UserID)
				followersMap[userID] = followersArray
			}
			fmt.Println("Key added in map")

		}
		create := bson.M{
			"follower": userID,
			"followee": follwerReq.UserID}

		var result bson.M
		err = c.Insert(create)

		if err != nil {
			log.Fatal(err)
		}
		formatter.JSON(w, http.StatusOK, result)

		fmt.Println("After Follower Map: ", followersMap)
		fmt.Println("After Follower Array: ", followersArray)

	}

}

func stringInSlice(str string, list []string) bool {
	for _, v := range list {
		if v == str {
			return true
		}
	}
	return false
}

func initQueue() {
	var name string
	var timeout int64
	flag.StringVar(&name, "n", queue_name, "Queue name")
	flag.Int64Var(&timeout, "t", 5, "(Optional) Timeout in seconds for long polling")
	flag.Parse()

	if len(name) == 0 {
		flag.PrintDefaults()
		panic("Queue name required")
	}

	sess, err := session.NewSession(&aws.Config{
		Region: aws.String("us-east-1")},
	)

	// Create a SQS service client.
	svc := sqs.New(sess)

	resultURL, err := svc.GetQueueUrl(&sqs.GetQueueUrlInput{
		QueueName: aws.String(name),
	})
	if err != nil {
		if aerr, ok := err.(awserr.Error); ok && aerr.Code() == sqs.ErrCodeQueueDoesNotExist {
			fmt.Println("Unable to find queue %q.", name)
		}
		fmt.Println("Unable to queue %q, %v.", name, err)
	}

	stopChan := make(chan bool)

	go func() {
		// Receive a message from the SQS queue with long polling enabled.
		for {
			result, err := svc.ReceiveMessage(&sqs.ReceiveMessageInput{
				QueueUrl: resultURL.QueueUrl,
				AttributeNames: aws.StringSlice([]string{
					"SentTimestamp",
				}),
				MaxNumberOfMessages: aws.Int64(1),
				MessageAttributeNames: aws.StringSlice([]string{
					"All",
				}),
				WaitTimeSeconds: aws.Int64(timeout),
			})

			if err != nil {
				fmt.Println("Unable to receive message from queue %q, %v.", name, err)
			}

			fmt.Printf("Received %d messages.\n", len(result.Messages))
			if len(result.Messages) > 0 {
				fmt.Println(result.Messages[0])

				var requestMessage json.RawMessage
				if err := json.Unmarshal([]byte(*result.Messages[0].Body), &requestMessage); err != nil {
					// panic(err)
					continue
				}

				fmt.Println(requestMessage)

				var requestBody QueueFollow
				_ = json.Unmarshal(requestMessage, &requestBody)

				fmt.Println(requestBody)

				// Insert into mongoDB
				session, err := mgo.Dial(mongodbServer)
				if err != nil {
					fmt.Println("Failed to connect to mongo")
					continue
				}
				defer session.Close()
				session.SetMode(mgo.Monotonic, true)
				c := session.DB(mongodbDatabase).C(mongodbCollection)

				create := bson.M{
					"follower": requestBody.Id,
					"followee": requestBody.UserID}
				err = c.Insert(create)
				if err != nil {
					fmt.Println("Failed to add in mongo")
					continue
				}

				resultDelete, err := svc.DeleteMessage(&sqs.DeleteMessageInput{
					QueueUrl:      resultURL.QueueUrl,
					ReceiptHandle: result.Messages[0].ReceiptHandle,
				})

				if err != nil {
					fmt.Println("Delete Error", err)
					continue
				}

				fmt.Println("Message Deleted", resultDelete)
			}
		}
	}()
	<-stopChan
}
