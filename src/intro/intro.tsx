import React from "react";
import { getAuth, getRedirectResult } from "@firebase/auth";
import { withRouter } from "react-router";

interface IIntroProps {
  history: any;
  location: any;
  match: any;
}

class Intro extends React.Component<IIntroProps, {}> {
  constructor(props: IIntroProps) {
    super(props);
    let auth = getAuth();

    if (auth.currentUser == null) {
      getRedirectResult(auth)
        .then(() => {
          if (auth.currentUser == null) {
            throw Error;
          }
          this.props.history.push("/main");
        })
        .catch((error) => {
          this.props.history.push("/login");
        });
    }
  }

  componentDidMount() {}

  render() {
    return <div></div>;
  }
}

export default withRouter(Intro);