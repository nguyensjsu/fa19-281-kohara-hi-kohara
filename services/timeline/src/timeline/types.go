/*
	Timeline API in Go 
	Uses Redis
*/

package main

type likes struct {
	Username		string 	
}

type comments struct {
	Username		string
	Message			string 	 	
}

type post struct {
	Username        string	
	PostImage   	string    	
	Caption 		string	    
	Likes 			likes	
	Comments		comments
}

type timeline struct {
	Username        string	
	Posts   		string    	
}

type errorMessage struct {
	Message        string	  	
}


// var machine gumballMachine = gumballMachine{
// 	Id:            1,
// 	CountGumballs: 900,
// 	ModelNumber:   "M102988",
// 	SerialNumber:  "1234998871109",
// }

var posts []post


//var orders map[string] order
