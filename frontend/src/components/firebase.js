import React, { Component } from "react";
var firebase = require("firebase/app");
require("firebase/auth");

var firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
};

firebase.initializeApp(firebaseConfig);



export var signoutFirebase = () => {
  firebase
    .auth()
    .signOut()
    .then(function() {
      console.log("Sign-out successful");
    })
    .catch(function(error) {
      console.log("An error happened in signout", error);
    });
};

export var signUpWithCredentials = (email, password) => {
  console.log("In Firebase SignUp");
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(user => {
      console.log(user);
      sendVerificationEmail();
      return user;
    })
    .catch(function(error) {
      console.log(error);
      window.alert(error.message);
    });
};

export var loginWithCredentials = (email, password) => {
  console.log("Firebase login", email, password);
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(user => {
      console.log(user);
      return user;
    })
    .catch(function(error) {
      console.log(error);
      window.alert(error.message);
    });
};

export var getFirebaseUser = () => {
  return firebase.auth().currentUser;
};

