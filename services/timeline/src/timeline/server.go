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
    "time"
    "strings"
)


//var redis_connect = "localhost:6379"
var riak_connect = os.Getenv("RIAK_ENDPOINT")

//var followee_service_base_url = "https://virtserver.swaggerhub.com/saketthakare/instagram-cmpe281/1/following/"

var followee_service_base_url = os.Getenv("FOLLOWING_ENDPOINT")


//var post_service_base_url = "https://virtserver.swaggerhub.com/saketthakare/instagram-cmpe281/1/posts/"
var post_service_base_url = os.Getenv("POST_ENDPOINT")

type Client struct {
    Endpoint string
    *http.Client
}

var tr = &http.Transport{
    MaxIdleConns:       10,
    IdleConnTimeout:    30 * time.Second,
    DisableCompression: true,
}

var debug = true

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

func NewClient(server string) *Client {
    return &Client{
        Endpoint:   server,
        Client:     &http.Client{Transport: tr},
    }
}

func (c *Client) Ping() (string, error) {
    resp, err := c.Get(c.Endpoint + "/ping" )
    if err != nil {
        fmt.Println("[RIAK DEBUG] " + err.Error())
        return "Ping Error!", err
    }
    defer resp.Body.Close()
    body, err := ioutil.ReadAll(resp.Body)
    if debug { fmt.Println("[RIAK DEBUG] GET: " + c.Endpoint + "/ping => " + string(body)) }
    return string(body), nil
}

func (c *Client) GetPosts(key string) ([][]post, error) {
    resp, err := c.Get(c.Endpoint + "/buckets/posts/keys/"+key )
    var post_nil = [][]post {}
    var posts_array [][]post

    if err != nil {
        fmt.Println("[RIAK DEBUG] " + err.Error())
        return post_nil, err
    }
    defer resp.Body.Close()
    body, err := ioutil.ReadAll(resp.Body)
    if debug { fmt.Println("[RIAK DEBUG] GET: " + c.Endpoint + "/buckets/posts/keys/"+key +" => " + string(body)) }
    
    json.Unmarshal([]byte(body), &posts_array)

    return posts_array, nil
}


var c1 = NewClient(riak_connect)


func init() {

    msg, err := c1.Ping()
    if err != nil {
        log.Fatal(err)
    } else {
        log.Println("Riak Ping Server: ", msg)     
    }


    if (len(riak_connect) == 0) {
            riak_connect = "localhost:8098"
    }

    if (len(followee_service_base_url) == 0) {
            followee_service_base_url = "https://virtserver.swaggerhub.com/saketthakare/instagram-cmpe281/1/following/"
    }

    if  (len(post_service_base_url) == 0) {
            post_service_base_url = "https://virtserver.swaggerhub.com/saketthakare/instagram-cmpe281/1/posts/"
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

		params := mux.Vars(req)

		var username string = params["id"]
		fmt.Println( "User name: ", username )

		if username == ""  {	
			formatter.JSON(w, http.StatusBadRequest, struct{ Message string }{"Bad Request. Retry again with correct username..."})	
		} else {

        posts_array, err := c1.GetPosts(username)
        if err != nil {
            fmt.Println( "Error connecting to RIAK cluster", err)
        }

			if (len(posts_array) == 0) {	//not found in riak DB
				fmt.Println( "Value not found in RIAK for : ", username )

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

                    _, err := c1.Post(c1.Endpoint + "/buckets/posts/keys/"+username+"?returnbody=true", 
                        "application/json", strings.NewReader(string(p)))


                    if err != nil {
                        fmt.Printf("Error saving in RIAK %s\n", err)
                    }

                    formatter.JSON(w, http.StatusOK, posts_array)             
			    }
		   } else {
                    fmt.Println("Found in Redis Cache. Returnin0 from there...")
                    formatter.JSON(w, http.StatusOK, posts_array)
             }

        }
	}
}



  


