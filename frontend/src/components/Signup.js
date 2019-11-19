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
        <div className="login-one">Sign up for Instagram</div>
        <br />
        <div className="login-two">
          Already have an account? <a href="/login">Login</a>
        </div>

        <div className="login-container">
          <div className="container">
            <div className="form-header">Account Sign up</div>
            <hr />

            <input
              type="input"
              name="firstname"
              autoFocus
              className="form-control"
              placeholder="First Name"
              onChange={this.handleChange}
              value={this.state.firstname}
            />
            <br />
            <input
              type="input"
              name="lastname"
              className="form-control"
              placeholder="Last Name"
              onChange={this.handleChange}
              value={this.state.lastname}
            />
            <br />
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email Address"
              onChange={this.handleChange}
              value={this.state.email}
            />
            <br />
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              onChange={this.handleChange}
              value={this.state.password}
            />
            <form onSubmit={this.handleSubmit}>
              <button type="submit" className="login-btn">
                Sign up
              </button>
            </form>
          </div>
        </div>

      </div>
    );
  }
}

export default Signup;
