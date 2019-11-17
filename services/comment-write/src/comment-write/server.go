/*
	Follow Post Microservice
*/

package main

import (
	"encoding/json"
	"log"

	"net/http"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"github.com/codegangsta/negroni"
	"github.com/gorilla/mux"
	"github.com/unrolled/render"
)

// MongoDB Config
var mongodb_server = "mongodb://localhost:32768/?authSource=admin"
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
	mx.HandleFunc("/{id}", addNewCommentHandler(formatter)).Methods("POST")
}

// API Ping Handler
func pingHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		formatter.JSON(w, http.StatusOK, struct{ Test string }{"Comment Write alive!"})
	}
}

// API to add a new comment
func addNewCommentHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		session, err := mgo.Dial(mongodb_server)
		if err != nil {
			panic(err)
		}
		defer session.Close()
		session.SetMode(mgo.Monotonic, true)
		c := session.DB(mongodb_database).C(mongodb_collection)

		params := mux.Vars(req)
		postId := params["id"]
		var requestBody comment
		_ = json.NewDecoder(req.Body).Decode(&requestBody)
		create := bson.M{
			"Username": requestBody.Username,
			"PostId":   postId,
			"Message":  requestBody.Message}
		err = c.Insert(create)
		if err != nil {
			log.Fatal(err)
		}
		formatter.JSON(w, http.StatusOK, requestBody.Username)
	}
}
