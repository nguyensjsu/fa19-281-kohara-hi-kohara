import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Signup from "./Signup";
import Dummy from "./Dummy";


class Main extends Component {
  render() {
    return (
      <Switch>
        <Route path="/" exact component={Dummy} />
        <Route path="/signup" exact component={Signup} />
        <Redirect to="/not-found" />
      </Switch>
    );
  }
}

export default Main;