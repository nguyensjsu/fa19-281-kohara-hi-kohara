import React from 'react';
import { BrowserRouter } from "react-router-dom";
import Main from "./components/Main";

let lgt =  function(){
  window.localStorage.clear();
  window.location.href= "./login";
}

function App() {



  return (
        <BrowserRouter>
          <div>
            <Main />
            
            {
            window.localStorage.getItem("Username") ?
              (<div className="lgt" onClick={lgt}>
              Logout
            </div>): null 
            }
          </div>
        </BrowserRouter>
  );

}

export default App;
