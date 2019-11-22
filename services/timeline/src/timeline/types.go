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

type following struct {
	Followee		string
}

type post struct {
	ID       		string
	Username		string
	Image   		string    	
	Caption 		string	    
	Likes[] 		likes	
	Comments[]		comments
}

type timeline struct {
	Username        string	
	Posts   		string    	
}

type errorMessage struct {
	Message        string	  	
}


var posts []post


