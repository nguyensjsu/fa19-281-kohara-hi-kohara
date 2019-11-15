package main

import (
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
		if followersMap == nil {
			followersMap = make(map[string][]string)
		}
		followersMap["arkil"] = []string{"thor", "hulk"}
		followersMap["dhoni"] = []string{"jadeja", "raina"}

		followersArray := followersMap[userID]
		fmt.Println("followersArray: ", followersArray)
		formatter.JSON(w, http.StatusOK, followersArray)
	}
}
