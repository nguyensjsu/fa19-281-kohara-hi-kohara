/*
	Login Microservice
*/

package main

type Login_req struct {
	Username string
	Password string
}

type Login_res struct {
	Id        string
	Firstname string
	Lastname  string
	Username  string
}
