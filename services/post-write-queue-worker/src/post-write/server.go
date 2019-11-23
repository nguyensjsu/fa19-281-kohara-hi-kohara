/*
	Post Write Microservice
*/

package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/codegangsta/negroni"
	"github.com/gorilla/mux"
	"github.com/unrolled/render"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/sqs"
)

// MongoDB Config
var mongodb_server = "mongodb://admin:admin@10.4.1.57:27017/?authSource=admin"
var mongodb_database = "post"
var mongodb_collection = "post"
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
	if len(os.Getenv("MONGO")) != 0 {
		mongodb_server = os.Getenv("MONGO")
	}
	if len(os.Getenv("QUEUE")) != 0 {
		queue_name = os.Getenv("QUEUE")
	}
	fmt.Println("ENVIRONMENT")
	fmt.Println("MONGO URL = ", os.Getenv("MONGO"))

	fmt.Println("SERVER INIT")
	fmt.Println("MONGO URL = ", mongodb_server)

	fmt.Println("QUEUE INIT")
	initQueue()

	return n
}

// API Routes
func initRoutes(mx *mux.Router, formatter *render.Render) {
	mx.HandleFunc("/ping", pingHandler(formatter)).Methods("GET")
	mx.HandleFunc("/{id}", addNewLikeHandler(formatter)).Methods("POST")
}

// API Ping Handler
func pingHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		formatter.JSON(w, http.StatusOK, struct{ Test string }{"Post Write alive!"})
	}
}

// API to add a new post
func addNewLikeHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		session, err := mgo.Dial(mongodb_server)
		if err != nil {
			panic(err)
		}
		defer session.Close()
		session.SetMode(mgo.Monotonic, true)
		c := session.DB(mongodb_database).C(mongodb_collection)

		params := mux.Vars(req)
		userId := params["id"]
		var requestBody Post
		_ = json.NewDecoder(req.Body).Decode(&requestBody)
		create := bson.M{
			"Username": userId,
			"Image":    requestBody.Image,
			"Caption":  requestBody.Caption}
		err = c.Insert(create)
		if err != nil {
			log.Fatal(err)
		}
		formatter.JSON(w, http.StatusOK, "Post added successfully")
	}
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

				var requestBody QueuePost
				_ = json.Unmarshal(requestMessage, &requestBody)

				fmt.Println(requestBody)

				// Insert into mongoDB
				session, err := mgo.Dial(mongodb_server)
				if err != nil {
					continue
				}
				defer session.Close()
				session.SetMode(mgo.Monotonic, true)
				c := session.DB(mongodb_database).C(mongodb_collection)

				create := bson.M{
					"Username": requestBody.Username,
					"Image":    requestBody.Image,
					"Caption":  requestBody.Caption}
				err = c.Insert(create)
				if err != nil {
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
