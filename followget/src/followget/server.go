package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/codegangsta/negroni"
	"github.com/gorilla/mux"
	"github.com/unrolled/render"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

var mongodbServer = "mongodb://admin:admin@10.0.1.202:27017/?authSource=admin"
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
	return n
}

// API Routes
func initRoutes(mx *mux.Router, formatter *render.Render) {
	mx.HandleFunc("/ping", pingHandler(formatter)).Methods("GET")
	mx.HandleFunc("/follow/{id}", getFriendListHandler(formatter)).Methods("GET")

}

// API Ping Handler
func pingHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		formatter.JSON(w, http.StatusOK, struct{ Test string }{"Follow Get API alive!"})
	}
}

// Get Friendlist order
func getFriendListHandler(formatter *render.Render) http.HandlerFunc {
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
		var result bson.M
		err = c.Find(bson.M{"userID": userID}).One(&result)
		if err != nil {
			log.Fatal(err)
		}
		if followersMap == nil {
			followersMap = make(map[string][]string)
		}
		followersMap["arkil"] = []string{"thor", "hulk"}
		followersMap["dhoni"] = []string{"jadeja", "raina"}

		followersArray := followersMap[userID]
		fmt.Println("followersArray: ", followersArray)
		formatter.JSON(w, http.StatusOK, result)
	}
}
