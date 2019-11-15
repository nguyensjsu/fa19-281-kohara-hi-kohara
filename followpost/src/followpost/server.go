/*
	Follow Post Microservice
*/

package main

import (
	"encoding/json"
	"fmt"

	"net/http"

	"github.com/codegangsta/negroni"
	"github.com/gorilla/mux"
	"github.com/unrolled/render"
)

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
