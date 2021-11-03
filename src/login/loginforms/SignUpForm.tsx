import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import styles from "../App.module.css"

interface ISignUpFormState {
  email: string;
  password: string;
  name: string;
  hasAgreed: number;
}

export default class SignUpForm extends Component<{}, ISignUpFormState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      email: "",
      password: "",
      name: "",
      hasAgreed: 0,
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
    } as unknown as Pick<ISignUpFormState, keyof ISignUpFormState>);
  }

  handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log(this.state);
  }

  render() {
    return (
      <div className={styles.formCenter}>
        <form onSubmit={this.handleSubmit} className={styles.formFields}>
          <div className={styles.formField}>
            <label className={styles.formFieldLabel} htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className={styles.formFieldInput}
              placeholder="Enter your full name"
              name="name"
              value={this.state.name}
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
            <label className={styles.formFieldCheckboxLabel}>
              <input
                className={styles.formFieldCheckbox}
                type="checkbox"
                name="hasAgreed"
                value={this.state.hasAgreed}
                onChange={this.handleChange}
              />{" "}
              I agree all statements in{" "}

              <NavLink
                exact
                to="/tos"
                className={styles.formFieldTermsLink}

              >
terms of service
                  </NavLink>
{/* 
              <a href="null" className={styles.formFieldTermsLink}>
                terms of service
              </a> */}
            </label>
          </div>

          <div className={styles.formField}>
            <button className={styles.formFieldButton}>Sign Up</button>{" "}
            <Link to="/sign-in" className={styles.formFieldLink}>
              I'm already member
            </Link>
          </div>
        </form>
      </div>
    );
  }
}
