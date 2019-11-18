/*
	Post Read Microservice
*/

package main

import (
	"gopkg.in/mgo.v2/bson"
)

type Posts []Post

type Post struct {
	ID       bson.ObjectId `bson:"_id,omitempty"`
	Username string        `bson:"Username"`
	Image    string        `bson:"Image"`
	Caption  string        `bson:"Caption"`
}

type Comment struct {
	Username string
	Message  string
}

type Like struct {
	Username string
}

type Comments []Comment

type Likes []Like

type TimelinePost struct {
	ID       string
	Username string
	Image    string
	Caption  string
	Likes    Likes
	Comments Comments
}
