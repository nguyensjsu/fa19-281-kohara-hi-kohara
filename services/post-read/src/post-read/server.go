/*
	Follow Post Microservice
*/

package main

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"net/http"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"github.com/codegangsta/negroni"
	"github.com/gorilla/mux"
	"github.com/unrolled/render"
)

// MongoDB Config
var mongodb_server = "mongodb://localhost:32768/?authSource=admin"
var mongodb_database = "post"
var mongodb_collection = "post"
var comment_read = "http://localhost:3002"
var like_read = "http://localhost:4002"

var myClient = &http.Client{Timeout: 10 * time.Second}

func getHttpResponse(url string, target interface{}) error {
	r, err := myClient.Get(url)
	if err != nil {
		return err
	}
	defer r.Body.Close()

	return json.NewDecoder(r.Body).Decode(target)
}

// func DecodeArrData(inStructArr, outStructArr interface{}) error {
//     inStructArrData, err := bson.Marshal(inStructArr)
//     if err != nil {
//         return err
//     }
//     raw := bson.Raw{Kind: 4, Data: inStructArrData}
//     return raw.Unmarshal(outStructArr)
// }
func DecodeArrData(inStructArr, outStructArr interface{}) error {
	in := struct{ Data interface{} }{Data: inStructArr}
	inStructArrData, err := bson.Marshal(in)
	if err != nil {
		return err
	}
	var out struct{ Data bson.Raw }
	if err := bson.Unmarshal(inStructArrData, &out); err != nil {
		return err
	}
	return out.Data.Unmarshal(outStructArr)
}

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
	mx.HandleFunc("/{id}", getPostLikeHandler(formatter)).Methods("GET")
}

// API Ping Handler
func pingHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		formatter.JSON(w, http.StatusOK, struct{ Test string }{"Comment Write alive!"})
	}
}

// API to get all comments for a user
func getPostLikeHandler(formatter *render.Render) http.HandlerFunc {
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

		var result []bson.M
		err = c.Find(bson.M{"Username": userId}).All(&result)
		if err != nil {
			log.Fatal(err)
		}

		var posts []Post
		err = c.Find(bson.M{"Username": userId}).All(&posts)
		if err != nil {
			log.Fatal(err)
		}

		fmt.Println("Posts", posts)

		comment_list := new(Comments)
		getHttpResponse(comment_read+"/"+"5dd20fb3793fe88e005c6cf9", comment_list)
		fmt.Println("COMMENT-RESPONSE", comment_list)

		formatter.JSON(w, http.StatusOK, result)
	}
}
