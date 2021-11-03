import React from "react";
import ReactDOM from "react-dom";
import "./index.module.css";
import App from "./login/App";
import reportWebVitals from "./reportWebVitals";
import initFirebase from "./firebase/init";
import { BrowserRouter, Route } from "react-router-dom";
import Main from "./main/Main";
import Intro from "./intro/intro"
import 'bootstrap/dist/css/bootstrap.min.css'
initFirebase();

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Route path="/" render={() => <Intro />} />
      <Route path="/login" render={() => <App title="Auctioneer" />} />
      <Route path="/main" render={() => <Main />} />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();



