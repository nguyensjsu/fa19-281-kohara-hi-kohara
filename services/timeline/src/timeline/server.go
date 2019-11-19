/*
	Timeline API in Go 
	Uses Redis
*/

package main

import (
    "os"
	"fmt"
	"log"
	"net/http"
	"io/ioutil"
	"encoding/json"
	"github.com/codegangsta/negroni"
	"github.com/gorilla/mux"
	"github.com/unrolled/render"
    "github.com/go-redis/redis"
    "time"
    "strconv"
)


//var redis_connect = "localhost:6379"
var redis_connect = os.Getenv("REDIS_ENDPOINT")

//var followee_service_base_url = "https://virtserver.swaggerhub.com/saketthakare/instagram-cmpe281/1/following/"

var followee_service_base_url = os.Getenv("FOLLOWING_ENDPOINT")


//var post_service_base_url = "https://virtserver.swaggerhub.com/saketthakare/instagram-cmpe281/1/posts/"
var post_service_base_url = os.Getenv("POST_ENDPOINT")

var redis_cache_timeout = os.Getenv("REDIS_CACHE_TIMEOUT")

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


    if (len(redis_connect) == 0) {
            redis_connect = "localhost:6379"
    }

    if (len(followee_service_base_url) == 0) {
            followee_service_base_url = "https://virtserver.swaggerhub.com/saketthakare/instagram-cmpe281/1/following/"
    }

    if  (len(post_service_base_url) == 0) {
            post_service_base_url = "https://virtserver.swaggerhub.com/saketthakare/instagram-cmpe281/1/posts/"
    }

    if  (len(redis_cache_timeout) == 0) {
            redis_cache_timeout = "300"
    }
 
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

        var posts_array [][]post




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

                    p, _ := json.Marshal(posts_array)

                    i, _ := strconv.Atoi(redis_cache_timeout)
                    fmt.Println("Setting cache timeout to %s seconds", i) // Output: 100ms

                    d2 := time.Duration(i) * time.Second
                    fmt.Println(d2) // Output: 100ms

                    err := redis_client.Set(username, string(p),d2).Err()

                    if err != nil {
                        panic(err)
                    } 

                    formatter.JSON(w, http.StatusOK, posts_array)             
			    }
		   } else {
                    fmt.Println("Found in Redis Cache. Returnin0 from there...")
                    json.Unmarshal([]byte(val), &posts_array)
                    formatter.JSON(w, http.StatusOK, posts_array)
             }

        }
	}
}



  


