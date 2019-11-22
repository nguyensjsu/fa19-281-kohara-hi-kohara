import React, { Component } from "react";
var firebase = require("firebase/app");
require("firebase/auth");

// var firebaseConfig = {
//   apiKey: "",
//   authDomain: "",
//   databaseURL: "",
//   projectId: "",
//   storageBucket: "",
//   messagingSenderId: ""
// };


var firebaseConfig = {
  apiKey: "AIzaSyCDmtzxw_sbN0Cs5wqEyZG8LAMIpzvzJQE",
  authDomain: "instagram-71ef5.firebaseapp.com",
  databaseURL: "https://instagram-71ef5.firebaseio.com",
  projectId: "instagram-71ef5",
  storageBucket: "instagram-71ef5.appspot.com",
  messagingSenderId: "800360146479",
  appId: "1:800360146479:web:e8048a2cb608afc3db88da",
  measurementId: "G-SN6PWGMFNV"
};


firebase.initializeApp(firebaseConfig);

// export var signoutFirebase = () => {
//   firebase
//     .auth()
//     .signOut()
//     .then(function() {
//       console.log("Sign-out successful");
//     })
//     .catch(function(error) {
//       console.log("An error happened in signout", error);
//     });
// };

export var signUpWithCredentials = (email, password) => {
  console.log("Firebase SignUp ",email, " " ,password)
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(user => {
      console.log(user);
      return user;
    })
    .catch(function(error) {
      console.log(error);
      window.alert(error.message);
    });
};

export var loginWithCredentials = (email, password) => {
  console.log("Firebase login", email," ", password);
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

