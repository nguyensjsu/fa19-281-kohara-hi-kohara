# Firebase Authentication Service

## Steps to add in Node.Js Application

1. Navigate in your Node.js (here, React) root directory

```javascript
	npm init
	npm install --save firebase
```

Create a file, firebase.js and import firebase

```javascript
	// Firebase App (the core Firebase SDK) is always required and
	// must be listed before other Firebase SDKs
	import * as firebase from "firebase/app";

	// Add the Firebase services that you want to use
	import "firebase/auth";
	import "firebase/firestore";
```

Initialize Firebase in your app

```javascript
	// TODO: Replace the following with your app's Firebase project configuration
	var firebaseConfig = {
	  // ...
	};

	// Initialize Firebase
	firebase.initializeApp(firebaseConfig);
````

Get config file

 - Sign in to Firebase, then open your project.
 - Click the Settings icon, then select Project settings.
 - In the Your apps card, select the nickname of the app for which you need a config object.
 - Select Config from the Firebase SDK snippet pane.
 - Copy the config object snippet, then add it to your app's HTML.

Sample config file object looks like

```javascript
var firebaseConfig = {
   apiKey: "",
   authDomain: "",
   databaseURL: "",
   projectId: "",
   storageBucket: "",
   messagingSenderId: ""
 };

```

Use the following methods in your application

1. Sign Up

```javascript
firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});
```

2. Login 

```javascript
firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});
```

3. Sign out

```javascript
firebase.auth().signOut().then(function() {
  // Sign-out successful.
}).catch(function(error) {
  // An error happened.
});
```

