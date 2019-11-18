/*
	Timeline API in Go 
	Uses Redis
*/

package main

import (
	"fmt"
	"log"
	"net/http"
	"io/ioutil"
	"encoding/json"
	"github.com/codegangsta/negroni"
	"github.com/gorilla/mux"
	"github.com/unrolled/render"
	_ "github.com/go-sql-driver/mysql"
	"github.com/go-redis/redis"
)

/*
	Go's SQL Package:  
		Tutorial: http://go-database-sql.org/index.html
		Reference: https://golang.org/pkg/database/sql/

	Go's Redis Package:
		Github: https://github.com/go-redis/redis
		Example: https://github.com/go-redis/redis/blob/master/example_test.go
*/


//var redis_connect = "localhost:6379"
var redis_connect = "localhost:6379"

var followee_service_base_url = "https://virtserver.swaggerhub.com/saketthakare/instagram-cmpe281/1/following/"

var post_service_base_url = "https://virtserver.swaggerhub.com/saketthakare/instagram-cmpe281/1/posts/"

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

// Init MySQL & Redis DB Connections

var redis_client *redis.Client

func init() {

	// Test Redis Connection
	redis_client := redis.NewClient(&redis.Options{
		Addr:     redis_connect,
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	pong, err := redis_client.Ping().Result()
	fmt.Println(pong, err)

}


// API Routes
func initRoutes(mx *mux.Router, formatter *render.Render) {
	mx.HandleFunc("/ping", pingHandler(formatter)).Methods("GET")
	mx.HandleFunc("/timeline/{id}", timelineHandler(formatter)).Methods("GET")

}

// Helper Functions
func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
		panic(fmt.Sprintf("%s: %s", msg, err))
	}
}

// API Ping Handler
func pingHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		formatter.JSON(w, http.StatusOK, struct{ Test string }{"API version 1.0 alive!"})
	}
}

// API Get Timeline for a user
func timelineHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {

		redis_client := redis.NewClient(&redis.Options{
			Addr:     redis_connect,
			Password: "", // no password set
			DB:       0,  // use default DB
		})

		params := mux.Vars(req)

		var username string = params["id"]
		fmt.Println( "User name: ", username )

		if username == ""  {	
			formatter.JSON(w, http.StatusBadRequest, struct{ Message string }{"Bad Request. Retry again with correct username..."})	
		} else {
			// check if posts are found in Redis cache. If so, return them...

			val, _ := redis_client.Get(username).Result()

			if (len(val) == 0) {	//not found in redis cache
				fmt.Println( "Value not found in Redis for : ", username )

				var followee_url = followee_service_base_url + username
				response, err := http.Get(followee_url)

				if err != nil {
       				fmt.Printf("The HTTP request failed with error %s\n", err)
    			} else {
        			data, _ := ioutil.ReadAll(response.Body)
        			fmt.Println(string(data))

        			var followees[] following

                    var posts_array [][]post

        			json.Unmarshal([]byte(data), &followees)

        			for _, value := range followees {
						fmt.Printf("Value2: %s", value.UserId)
						var post_url = post_service_base_url + value.UserId

						response, err := http.Get(post_url)

						if err != nil {
       						fmt.Printf("The HTTP request failed with error %s\n", err)
    					} else {
        					data2, _ := ioutil.ReadAll(response.Body)
        					fmt.Println(string(data2))
					        var posts[] post
					        json.Unmarshal([]byte(data2), &posts)
                            fmt.Println(posts)
                            posts_array = append(posts_array, posts)
                        }
                    }

                    formatter.JSON(w, http.StatusOK, posts_array)                             
			    }
		   }
	   }
    }
}


  


