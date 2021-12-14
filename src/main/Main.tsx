import { Auth, getAuth, getRedirectResult } from "@firebase/auth";
import React from "react";
import { BrowserRouter, Route, withRouter } from "react-router-dom";
import { MyAuctions } from "../auction/myauctuions";
import { Auctions } from "../auction/auctions";
import MyNavbar from "../navbar/navbar";
import styles from "./Main.module.css"

interface IMainProps {
  history: any;
  location: any;
  match: any;
}

interface IMainState {
  name: string | null | undefined;
}

class Main extends React.Component<IMainProps, IMainState> {
  auth: Auth | undefined;
  constructor(props: IMainProps) {
    super(props);
    this.state = {
      name: "",
    };
  }

  componentDidMount() {
    this.auth = getAuth();

    if (this.auth.currentUser == null) {
      getRedirectResult(this.auth)
        .then(() => {
          this.setState({ name: this.auth?.currentUser?.displayName });
        })
        .catch((error) => {
          this.props.history.push("/");
        });
    }
    this.setState({ name: this.auth.currentUser?.displayName });
  }

  render() {
    return (
      <BrowserRouter>
        <MyNavbar />
        <div className={styles.darkContent}>
          <Route exact path="/main" component={Auctions} />
          <Route path="/main/auctions" component={Auctions} />
          <Route path="/main/myauctions" component={MyAuctions} />
        </div>
      </BrowserRouter>
    );
  }
}

export default withRouter(Main);
