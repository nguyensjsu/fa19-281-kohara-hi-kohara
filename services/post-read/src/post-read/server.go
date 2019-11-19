/*
	Post Read Microservice
*/

package main

import (
	"encoding/json"
	"log"
	"os"
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

	if len(os.Getenv("MONGO")) == 0 {
		mongodb_server = os.Getenv("MONGO")
	}
	if len(os.Getenv("COMMENTREAD")) == 0 {
		comment_read = os.Getenv("COMMENTREAD")
	}
	if len(os.Getenv("LIKEREAD")) == 0 {
		like_read = os.Getenv("LIKEREAD")
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

// API to get all posts for a user
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

		var posts []Post
		err = c.Find(bson.M{"Username": userId}).All(&posts)
		if err != nil {
			log.Fatal(err)
		}

		timeline := []TimelinePost{}
		for index := 0; index < len(posts); index++ {
			var timelinePost TimelinePost
			timelinePost.ID = posts[index].ID.Hex()
			timelinePost.Username = posts[index].Username
			timelinePost.Caption = posts[index].Caption
			timelinePost.Image = posts[index].Image

			comment_list := new(Comments)
			getHttpResponse(comment_read+"/"+timelinePost.ID, comment_list)
			timelinePost.Comments = *comment_list

			like_list := new(Likes)
			getHttpResponse(like_read+"/"+timelinePost.ID, like_list)
			timelinePost.Likes = *like_list

			timeline = append(timeline, timelinePost)
		}

		formatter.JSON(w, http.StatusOK, timeline)
	}
}
