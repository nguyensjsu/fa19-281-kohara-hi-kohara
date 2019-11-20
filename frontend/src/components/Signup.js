import React, {Component} from "react";
import axios from "axios";
import { Redirect } from "react-router";


class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        firstname: "",
        lastname: "",
        email: "",
        password: ""
      },
      errors: {},
      dbErrors: ""
    };
  }

  doSubmit = () => {

  };


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
              onChange={this.handleChange}
              value={this.state.firstname}
            />
                  </div>
                <div class="form-group">
                  
                <input
              type="input"
              name="lastname"
              className="form-control"
              placeholder="Last Name"
              onChange={this.handleChange}
              value={this.state.lastname}
            />
                  </div>
                <div class="form-group">
                  
                      <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Email Address"
                    onChange={this.handleChange}
                    value={this.state.email}
                  />
                  </div>
                  <div class="form-group">
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Password"
                      onChange={this.handleChange}
                      value={this.state.password}
                    />
                  </div>
                  <button type="button" class="btn instagradient logbtn">Log In</button>
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
