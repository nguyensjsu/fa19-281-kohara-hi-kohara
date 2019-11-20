import React, {Component} from "react";
import axios from "axios";
import { Redirect } from "react-router";
import './styles/Login.css';

class Login extends Component {
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
      <React.Fragment>
          <section id="w3hubs">
              <div class="container ex">
              
                <h1>
                  <img className="login-logo" src="https://cdn3.iconfinder.com/data/icons/transparent-on-dark-grey/500/icon-04-512.png" />
                  <img className="login-image-text" src="https://clipart.info/images/ccovers/1522452762Instagram-logo-png-text.png"/>
                  

                </h1>
                <form action="#" method="POST">
                <div class="form-group">
                  
                    <input type="name" class="form-control" placeholder="Phone number,username, or email" />
                  </div>
                  <div class="form-group">
                  
                    <input type="password" class="form-control" placeholder="Password" />
                  </div>
                  <button type="button" class="btn btn-primary">Log In</button>
                </form>
                <h4>OR</h4>
                <p className="no-pad"><i class="fa fa-facebook-square"></i><a href="#">Log In Facebook</a></p>
                <p className="no-pad"><a href="#">Forget Password</a></p>
          </div>
                <div class="box">
                  <p className="no-pad">Don't have account? <a href="#">Sign up</a></p>
                </div>
              
            
            </section>
       

      </React.Fragment>
    );
  }
}

export default Login;
