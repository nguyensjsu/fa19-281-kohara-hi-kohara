/*
	Follow Post Microservice
*/

package main

import (
	"encoding/json"
	"fmt"

	"net/http"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"github.com/codegangsta/negroni"
	"github.com/gorilla/mux"
	"github.com/unrolled/render"
)

// MongoDB Config
var mongodb_server = "mongodb://admin:admin@10.0.1.202:27017/?authSource=admin"
var mongodb_database = "follow"
var mongodb_collection = "follow"

// NewServer configures and returns a Server.
func NewServer() *negroni.Negroni {
	formatter := render.New(render.Options{
		IndentJSON: true,
	})
	n := negroni.Classic()
	mx := mux.NewRouter()
	initRoutes(mx, formatter)
	n.UseHandler(mx)
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

		session, err := mgo.Dial(mongodb_server)
		if err != nil {
			panic(err)
		}
		defer session.Close()
		session.SetMode(mgo.Monotonic, true)
		c := session.DB(mongodb_database).C(mongodb_collection)

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
			formatter.JSON(w, http.StatusOK, follwerReq.UserID)
			fmt.Println("Key added: ", follwerReq.UserID)
		} else {

			if isFollowerAdded == false {
				followersArray = append(followersArray, follwerReq.UserID)
				followersMap[userID] = followersArray
			}
			fmt.Println("Key added in map")
			formatter.JSON(w, http.StatusOK, follwerReq.UserID)

		}
		query := bson.M{"userID": userID}
		var result bson.M
		err = c.Find(query).One(&result)
		if err != nil {
			create := bson.M{
				"userID":         userID,
				"FollowersArray": followersArray}
			err = c.Insert(create)

		} else {
			change := bson.M{"$set": bson.M{"FollowersArray": followersArray}}
			err = c.Update(query, change)
		}

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
