import React, {Component} from "react";
import axios from "axios";
import { Redirect } from "react-router";
import './styles/Login.css';
import { signUpWithCredentials } from "./firebase";
var firebase = require("firebase/app");
require("firebase/auth");


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        email: "",
        password: ""
      },
      errors: {},
      dbErrors: ""
    };
  }

  submitLogin = (e) => {
    var email = this.state.email;
    var password = this.state.password;

    var login = process.env.REACT_APP_LOGIN;

    var proxy = 'https://cors-anywhere.herokuapp.com/';
    //Incase you want to use this.setState after API call use _this and not this.
    let _this = this;

    // window.jQuery.ajax({
    //   url: proxy + login,
    //     complete:function(data){
    //       console.log("Response")
    //         console.log(data);
    //     }
    // });

      var login = process.env.REACT_APP_LOGIN;
      console.log(login);
      var proxy = process.env.REACT_APP_PROXY_URL;
      //Incase you want to use this.setState after API call use _this and not this.
      
    var send_data = {
      Username : email,
      Password : password
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(data => {                
                window.jQuery.ajax({
                    url: proxy + login,
                      method: "POST",
                      data: JSON.stringify(send_data),
                      "headers": {
                        "Content-Type": "application/json",
                      },
                      complete:function(data){
                        console.log("Response from Database")
                        console.log(data.responseJSON)
                          if(data.responseJSON){                
                            localStorage.setItem( "Username" , data.responseJSON.Username);
                            localStorage.setItem( "Firstname" , data.responseJSON.Firstname);
                            localStorage.setItem( "Lastname" , data.responseJSON.Lastname);
                          }
                          _this.props.history.push({pathname: "/feed"});
                      }
                  });
                window.alert("Login Successful");
            
          })
      .catch(function(error) {
      console.log(error);
      window.alert(error.message);
    });
  
      // window.jQuery.ajax({
      //   url: proxy + login,
      //     method: "POST",
      //     data: JSON.stringify(send_data),
      //     "headers": {
      //       "Content-Type": "application/json",
      //     },
      //     complete:function(data){
      //       console.log("Response")
      //       console.log(data);
      //       console.log(data.responseJSON)
      //         if(data.responseJSON){                
      //           localStorage.setItem( "Username" , data.responseJSON.Username);
      //           localStorage.setItem( "Firstname" , data.responseJSON.Firstname);
      //           localStorage.setItem( "Lastname" , data.responseJSON.Lastname);
      //         }
      //         _this.props.history.push({pathname: "/feed"});
      //     }
      // });
      var send_data = {
        Username : this.state.email,
        Password : this.state.password
      }

      window.jQuery.ajax({
        url: proxy + login,
          method: "POST",
          data: JSON.stringify(send_data),
          "headers": {
            "Content-Type": "application/json",
          },
          complete:function(data){
            console.log("Response")
            console.log(data);
            console.log(data.responseJSON)
              if(data.responseJSON){                
                localStorage.setItem( "Username" , data.responseJSON.Username);
                localStorage.setItem( "Firstname" , data.responseJSON.Firstname);
                localStorage.setItem( "Lastname" , data.responseJSON.Lastname);
                //setTimeout(()=>{
                  window.OneSignal.push(function() {
                    window.OneSignal.sendTag("username",data.responseJSON.Username);
                  });
                  _this.props.history.push({pathname: "/feed"});
                //},500);
              }
              
          }
      });

}

  render() {
    return (
      <React.Fragment>
          <section id="w3hubs">
              <div class="container ex">
              
                <h1>
                  <img className="login-logo" src="https://i.pinimg.com/originals/a2/5f/4f/a25f4f58938bbe61357ebca42d23866f.png" />
                  <img className="login-image-text" src="https://www.edigitalagency.com.au/wp-content/uploads/instagram-logo-text-blue-png.png"/>
                  

                </h1>
                <form action="#" method="POST">
                <div class="form-group">
                  
                    <input type="name" class="form-control" placeholder="Enter username"
                    onChange = {(event) => {this.setState({ email : event.target.value })}}
                     />
                  </div>
                  <div class="form-group">
                  
                    <input type="password" class="form-control" placeholder="Password" 
                    onChange = {(event) => {this.setState({ password : event.target.value })}}
                    />
                  </div>
                  <button type="button" class="btn instagradient logbtn" onClick = {this.submitLogin}>Log In</button>
                </form>
                <h4>OR</h4>
                
                
          </div>
                <div class="box">
                  <p className="no-pad">Don't have account? <a href="/signup">Sign up</a></p>
                </div>
              
            
            </section>
       

      </React.Fragment>
    );
  }
}

export default Login;
