import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import Profile from "./Profile";
import Feed from "./Feed";
import Dummy from "./Dummy";


class Main extends Component {
  render() {
    return (
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/signup" exact component={Signup} />
        <Route path="/login" exact component={Login} />
        <Route path="/profile/:id?" exact component={Profile} />
        <Route path="/feed" exact component={Feed} />
        <Redirect to="/not-found" />
      </Switch>
    );
  }
}

export default Main;
