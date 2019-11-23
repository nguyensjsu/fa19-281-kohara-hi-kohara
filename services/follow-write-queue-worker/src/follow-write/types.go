/*
	Follow Post Microservice
*/

package main

type follow struct {
	UserID string
}

type QueueFollow struct {
	Id     string
	UserID string
}

var followersMap map[string][]string
