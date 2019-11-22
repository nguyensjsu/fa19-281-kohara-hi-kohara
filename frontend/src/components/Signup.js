import React, {Component} from "react";
import axios from "axios";
import { Redirect } from "react-router";


class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // data: {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
      // },
      errors: {},
      dbErrors: ""
    };
  }

  submitSignup = (e) => {

    var signup_url = process.env.REACT_APP_SIGNUP;
    console.log(signup_url);
    var proxy = 'https://cors-anywhere.herokuapp.com/';
    //Incase you want to use this.setState after API call use _this and not this.
    let _this = this;

  //   window.jQuery.ajax({
  //     url: proxy + signup_url,
  //     complete:function(data){
  //       console.log("Response")
  //         console.log(data);
  //     }
  // });

    var send_data = {
        Firstname : this.state.firstname,
        Lastname  : this.state.lastname,
        Username : this.state.email,
        Password : this.state.password
    }

    console.log(send_data)
    window.jQuery.ajax({
      url: proxy + signup_url,
        method: "POST",
        data: JSON.stringify(send_data),
        "headers": {
          "Content-Type": "application/json",
        },
        complete:function(data){
          console.log("Response")
          console.log(data);
          console.log(data.responseJSON)
          _this.props.history.push({pathname: "/login"});
        }
    });

}


  render() {    
    return (
      <div className="home">

         <section id="w3hubs">
              <div class="container ex">
              
                <h1>
                  <img className="login-logo" src="https://i.pinimg.com/originals/a2/5f/4f/a25f4f58938bbe61357ebca42d23866f.png" />
                  <img className="login-image-text" src="https://www.edigitalagency.com.au/wp-content/uploads/instagram-logo-text-blue-png.png"/>
                  

                </h1>
                <form action="#" method="POST">
                
                <div class="form-group">
                  

            <input
              type="input"
              name="firstname"
              autoFocus
              className="form-control"
              placeholder="First Name"
              onChange = {(event) => {this.setState({ firstname : event.target.value })}}
              value={this.state.firstname}
            />
                  </div>
                <div class="form-group">
                  
                <input
              type="input"
              name="lastname"
              className="form-control"
              placeholder="Last Name"
              // onChange={this.handleChange}
              onChange = {(event) => {this.setState({ lastname : event.target.value })}}
              value={this.state.lastname}
            />
                  </div>
                <div class="form-group">
                  
                      <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Email Address"
                    onChange = {(event) => {this.setState({ email : event.target.value })}}
                    value={this.state.email}
                  />
                  </div>
                  <div class="form-group">
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Password"
                      onChange = {(event) => {this.setState({ password : event.target.value })}}
                      value={this.state.password}
                    />
                  </div>
                  <button type="button" class="btn instagradient logbtn" onClick = {this.submitSignup}>Log In</button>
                </form>
                <h4>OR</h4>

                <div class="box">
                  <p className="no-pad">Already have a account? <a href="/login">Login</a></p>
                </div>
                </div>
            
            </section>
      </div>
    );
  }
}

export default Signup;
