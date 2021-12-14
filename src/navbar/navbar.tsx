import React from "react";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { Auth, getAuth, signOut } from "@firebase/auth";
import { Button, Form, FormControl, Navbar } from "react-bootstrap";
import { NavLink, withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import styles from "../main/Main.module.css";

library.add(faSearch);

interface IMyNavbarProps {
  history: any;
  location: any;
  match: any;
}

interface IMyNavbarState {
  auth: Auth;
}

class MyNavbar extends React.Component<IMyNavbarProps, IMyNavbarState> {
  constructor(props: IMyNavbarProps) {
    super(props);
    let auth = getAuth();
    this.state = {
      auth: auth,
    };
  }

  logout() {
    signOut(this.state.auth)
      .then(this.gotoLogin.bind(this))
      .catch(this.gotoLogin.bind(this));
  }

  gotoLogin() {
    this.props.history.push("/login");
    window.location.reload();
  }

  render() {
    return (
      <Navbar bg="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand style={{ color: "white" }}>Auctioneer</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link
                as={NavLink}
                activeClassName={styles.formTitleLink_active}
                className={styles.formTitleLink}
                to="/main/auctions"
              >
                Auctions
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                activeClassName={styles.formTitleLink_active}
                className={styles.formTitleLink}
                to="/main/myauctions"
              >
                My auctions
              </Nav.Link>

              <Nav.Link
                as={NavLink}
                activeClassName={styles.formTitleLink_active}
                className={styles.formTitleLink}
                to="/main/mybids"
              >
                My bids
              </Nav.Link>
              <Form className="d-flex">
                <FormControl
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  style={{
                    color: "white",
                    background: "#12130f",
                    borderColor: "#11120e",
                  }}
                />
                <Button type="submit" variant="outline-success">
                  <FontAwesomeIcon icon="search" />
                </Button>
              </Form>
            </Nav>
          </Navbar.Collapse>
          <div className="d-flex">
            <Nav.Link
              disabled
              as={NavLink}
              activeClassName={styles.formTitleLink_active}
              className={styles.formTitleLink}
              to="/main/mybids"
            >
              {this.state.auth?.currentUser?.displayName}
            </Nav.Link>
            <Button variant="outline-danger" onClick={this.logout.bind(this)}>
              Log out
            </Button>
          </div>
        </Container>
      </Navbar>
    );
  }
}

export default withRouter(MyNavbar);
