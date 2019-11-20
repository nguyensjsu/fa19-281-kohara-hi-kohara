/*
	Signup Write Microservice
*/

package main

import (
	// "encoding/json"
	// "log"

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

var mongodb_server = "mongodb://localhost:27017"
var mongodb_database = "user"
var mongodb_collection = "user"

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
	mx.HandleFunc("/signup", signup(formatter)).Methods("POST")
}

// API Ping Handler
func pingHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		formatter.JSON(w, http.StatusOK, struct{ Test string }{"Signup is alive!"})
	}
}

// API to add a new user
func signup(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		session, err := mgo.Dial(mongodb_server)
		if err != nil {
			panic(err)
		}
		defer session.Close()
		session.SetMode(mgo.Monotonic, true)
		c := session.DB(mongodb_database).C(mongodb_collection)

		var requestBody Signup
		_ = json.NewDecoder(req.Body).Decode(&requestBody)

		var user bson.M
		err = c.Find(bson.M{"Username": requestBody.Username}).One(&user)

		if user["Username"] != requestBody.Username {
			create := bson.M{
				"Username":  requestBody.Username,
				"Password":  requestBody.Password,
				"Firstname": requestBody.Firstname,
				"Lastname":  requestBody.Lastname}

			err = c.Insert(create)

			if err != nil {
				log.Fatal(err)
			}
			formatter.JSON(w, http.StatusOK, requestBody.Username)
		} else {
			formatter.JSON(w, http.StatusBadRequest, requestBody.Username+" already exist")
		}

	}
}
