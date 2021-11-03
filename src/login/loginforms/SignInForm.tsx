import React, { Component } from "react";
import { Link } from "react-router-dom";
import styles from "../App.module.css"

interface ISignInFormProps {}

interface ISignInFormState {
  email: string;
  password: string;
}

class SignInForm extends Component<ISignInFormProps, ISignInFormState> {
  constructor(props: ISignInFormProps) {
    super(props);

    this.state = {
      email: "",
      password: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    let target = event.target;
    let value = target.type === "checkbox" ? target.checked : target.value;
    let name = target.name;
    this.setState({
      [name]: value,
    } as Pick<ISignInFormState, keyof ISignInFormState>);
  }

  handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(this.state);
  }

  render() {
    return (
      <div className={styles.formCenter}>
        <form className={styles.formFields} onSubmit={this.handleSubmit}>
          <div className={styles.formField}>
            <label className={styles.formFieldLabel} htmlFor="email">
              E-Mail Address
            </label>
            <input
              type="email"
              id="email"
              className={styles.formFieldInput}
              placeholder="Enter your email"
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </div>

          <div className={styles.formField}>
            <label className={styles.formFieldLabel} htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className={styles.formFieldInput}
              placeholder="Enter your password"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
          </div>

          <div className={styles.formField}>
            <button className={styles.formFieldButton}>Sign In</button>{" "}
            <Link to="/sign-up" className={styles.formFieldLink}>
              Create an account
            </Link>
          </div>
        </form>
      </div>
    );
  }
}

export default SignInForm;
