/*
	Follow Post Microservice
*/

package main

type follow struct {
	UserID string
}

var followersMap map[string][]string
