/*
	Comment Write Microservice
*/

package main

type comment struct {
	Username string
	Message  string
}

type QueueComment struct {
	Id       string
	Username string
	Message  string
}
