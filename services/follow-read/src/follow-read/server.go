package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/codegangsta/negroni"
	"github.com/gorilla/mux"
	"github.com/unrolled/render"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

var mongodbServer = "mongodb://admin:admin@10.3.1.166:27017/?authSource=admin"
var mongodbDatabase = "follow"
var mongodbCollection = "follow"

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
		mongodbServer = os.Getenv("MONGO")
	}

	fmt.Println("ENVIRONMENT")
	fmt.Println("MONGO URL = ", os.Getenv("MONGO"))

	fmt.Println("SERVER INIT")
	fmt.Println("MONGO URL = ", mongodbServer)

	return n
}

// API Routes
func initRoutes(mx *mux.Router, formatter *render.Render) {
	mx.HandleFunc("/ping", pingHandler(formatter)).Methods("GET")
	mx.HandleFunc("/followers/{id}", getFollowersHandler(formatter)).Methods("GET")
	mx.HandleFunc("/following/{id}", getFollowingHandler(formatter)).Methods("GET")
}

// API Ping Handler
func pingHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		formatter.JSON(w, http.StatusOK, struct{ Test string }{"Follow Get API alive!"})
	}
}

// Get Friendlist order
func getFollowersHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		params := mux.Vars(req)
		fmt.Println("params:", params)
		userID := params["id"]
		fmt.Println("user: ", userID)
		session, err := mgo.Dial(mongodbServer)
		if err != nil {
			panic(err)
		}
		defer session.Close()
		session.SetMode(mgo.Monotonic, true)
		c := session.DB(mongodbDatabase).C(mongodbCollection)

		if followersMap == nil {
			followersMap = make(map[string][]string)
		}
		followersMap["arkil"] = []string{"thor", "hulk"}
		followersMap["dhoni"] = []string{"jadeja", "raina"}

		followersArray := followersMap[userID]
		fmt.Println("followersArray: ", followersArray)
		var result []bson.M
		err = c.Find(bson.M{"followee": userID}).Select(bson.M{"follower": 1, "_id": 0}).All(&result)
		if err != nil {
			log.Fatal(err)
		}
		formatter.JSON(w, http.StatusOK, result)
	}
}

// Get Friendlist order
func getFollowingHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		params := mux.Vars(req)
		fmt.Println("params:", params)
		userID := params["id"]
		fmt.Println("user: ", userID)
		session, err := mgo.Dial(mongodbServer)
		if err != nil {
			panic(err)
		}
		defer session.Close()
		session.SetMode(mgo.Monotonic, true)
		c := session.DB(mongodbDatabase).C(mongodbCollection)

		//err = c.Find(nil).Select(bson.M{"to": 1}).All(&result)

		if followersMap == nil {
			followersMap = make(map[string][]string)
		}
		followersMap["arkil"] = []string{"thor", "hulk"}
		followersMap["dhoni"] = []string{"jadeja", "raina"}

		followersArray := followersMap[userID]
		fmt.Println("followersArray: ", followersArray)
		var result []bson.M
		err = c.Find(bson.M{"follower": userID}).Select(bson.M{"followee": 1, "_id": 0}).All(&result)
		if err != nil {
			log.Fatal(err)
		}
		formatter.JSON(w, http.StatusOK, result)
	}
}
