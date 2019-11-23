/*
	Post Write Microservice
*/

package main

type Post struct {
	Username string
	Image    string
	Caption  string
}

type QueuePost struct {
	Id       string
	Username string
	Image    string
	Caption  string
}
