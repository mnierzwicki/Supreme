import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import Form from "./styles/Form";
import Error from "./ErrorMessage";
import Success from "./SuccessMessage";
import { CURRENT_USER_QUERY } from "./User";

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`;

class SignUp extends React.Component {
  state = {
    name: "",
    password: "",
    email: ""
  };

  saveToState = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <Mutation mutation={SIGNUP_MUTATION} variables={this.state} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
        {(signup, { error, loading, called }) => {
          return (
            <Form
              method="post"
              onSubmit={async event => {
                event.preventDefault();
                try {
                  await signup();
                  this.setState({ name: "", email: "", password: "" });
                } catch (error) {
                  // Prevent GraphQL from displaying error message to console.log
                  // Instead, display a custom error message in the UI later.
                }
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Sign Up</h2>

                {error && <Error error={error} />}
                {!error && !loading && called && <Success message={"Sign up successful!"} />}

                <label htmlFor="email">
                  Email
                  <input type="email" name="email" placeholder="email" value={this.state.email} onChange={this.saveToState} />
                </label>
                <label htmlFor="name">
                  Name
                  <input type="text" name="name" placeholder="name" value={this.state.name} onChange={this.saveToState} />
                </label>
                <label htmlFor="password">
                  Password
                  <input type="password" name="password" placeholder="password" value={this.state.password} onChange={this.saveToState} />
                </label>
                <button type="submit">Sign Up</button>
              </fieldset>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default SignUp;
