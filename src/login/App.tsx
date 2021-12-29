import React from "react";
import { NavLink, Route, BrowserRouter, withRouter } from "react-router-dom";
import SignUpForm from "./loginforms/SignUpForm";
import SignInForm from "./loginforms/SignInForm";
import * as THREE from "three";
import { Tos } from "../tos/tos";
import styles from './App.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getRedirectResult, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { auth } from "../firebase/init";

library.add(faGoogle);
interface IAppProps {
  title: string;
  history: any;
  location: any;
  match: any;
}

interface IAppState {
  fullpagePyramid: boolean;
  isMobile: boolean;
}

class App extends React.Component<IAppProps, IAppState> {
  provider = new GoogleAuthProvider();
  winW = window.innerWidth;
  winH = window.innerHeight;
  renderer = new THREE.WebGLRenderer();
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, this.winW / this.winH, 0.01, 30);
  line: THREE.LineSegments;
  rightSide: React.RefObject<HTMLDivElement>;

  constructor(props: IAppProps) {
    super(props);
    this.line = new THREE.LineSegments();
    this.state = {
      fullpagePyramid: true,
      isMobile: false,
    };
    this.rightSide = React.createRef();
  }

  componentDidMount() {
    this.scene.background = new THREE.Color(0x12130f);
    this.renderer.setSize(this.winW, this.winH);

    var child = document.getElementById("appAside");
    child?.appendChild(this.renderer.domElement);

    this.addPyramid();
    this.updateAnimation();

    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  addPyramid(width: number = 3, height: number = 4) {
    var geometry = new THREE.CylinderGeometry(0, width, height, 4, 1, true);
    var wireframe = new THREE.WireframeGeometry(geometry);
    this.line = new THREE.LineSegments(wireframe);

    this.line.material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 1,
      linecap: "round", //ignored by WebGLRenderer
      linejoin: "round", //ignored by WebGLRenderer
      depthTest: false,
      opacity: 0.75,
      transparent: true,
    });

    this.scene.add(this.line);
    this.camera.position.z = 10;
  }

  removePyramid() {
    this.scene.remove(this.line);
  }

  updateAnimation() {
    requestAnimationFrame(this.updateAnimation.bind(this));
    this.line.rotation.y += 0.004;
    this.renderer.render(this.scene, this.camera);
  }

  updateDimensions() {
    let w = this.winW;
    let h = this.winH;

    this.winW = window.innerWidth / (this.state.fullpagePyramid ? 1 : 2);
    this.winH = window.innerHeight;

    if (w !== this.winW || h !== this.winH) {
      this.removePyramid();
      this.renderer.setSize(this.winW, this.winH);

      this.addPyramid(
        3 * (this.winH < h ? this.winH / h : 1),
        4 * (this.winW < w ? this.winW / w : 1)
      );
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  showrouters() {
    this.updateDimensions();
    return this.state.fullpagePyramid ? (
      <div></div>
    ) : (
      <div>
        <div className={styles.formTitle} ref={this.rightSide}>
          <NavLink
            to="/sign-in"
            activeClassName="formTitleLink-active"
            className={styles.formTitleLink}
          >
            Sign In
          </NavLink>{" "}
          or{" "}
          <NavLink
            exact
            to="sign-up"
            activeClassName="formTitleLink-active"
            className={styles.formTitleLink}
          >
            Sign Up
          </NavLink>
          or{" "}
          <div className={styles.formTitleLink}>
          <FontAwesomeIcon
            icon={["fab", "google"]}
            color="white"
            onClick={this.signInWithGoogle.bind(this)}
          />
          
          oogle
          </div>

        </div>

        <Route path="/sign-up" component={SignUpForm} />
        <Route
          path="/sign-in"
          render={() => (
            <SignInForm
            />
          )}
        />
        <Route path="/tos" component={Tos} />
      </div>
    );
  }

  signInWithGoogle() {

    if (this.state.isMobile) {
      getRedirectResult(auth)
        .then((result) => {
          if (result == null) {
            return;
          }
          this.signedIn();
        })
        .catch((error) => {
          // show error
        });
    } else {
      signInWithPopup(auth, this.provider)
        .then((result) => {
          this.signedIn();
        })
        .catch((error) => {
          // show error
        });
    }
  }

  signedIn() {
    this.props.history.push("/main");
  }

  onSwitchRoute() {
    this.setState({
      fullpagePyramid: false,
    });
  }

  render() {
    return (
      <BrowserRouter>
        <div className={styles.App}>
          <div className={styles.appAside} id="appAside" />
          <div className={styles.appForm}>
            <div className={styles.pageSwitcher}>
              <NavLink
                to="/sign-in"
                activeClassName="pageSwitcherItem-active"
                className={styles.pageSwitcherItem}
                onClick={this.onSwitchRoute.bind(this)}
              >
                Sign In
              </NavLink>
              <NavLink
                exact
                to="/sign-up"
                activeClassName="pageSwitcherItem-active"
                className={styles.pageSwitcherItem}
                onClick={this.onSwitchRoute.bind(this)}
              >
                Sign Up
              </NavLink>
            </div>

            {this.showrouters()}
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default withRouter(App);
