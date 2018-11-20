import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import SignUpStatus from "./SignUpStatus";

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
    email: "",
    signUpSuccess: false
  };

  saveToState = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <Mutation mutation={SIGNUP_MUTATION} variables={this.state}>
        {(signup, { error, loading }) => {
          return (
            <Form
              method="post"
              onSubmit={async event => {
                event.preventDefault();
                try {
                  const rsp = await signup();
                  this.setState({ name: "", email: "", password: "", signUpSuccess: true });
                } catch (error) {
                  this.setState({ signUpSuccess: false });
                  // Prevent GraphQL from displaying error message to console.log
                  // Instead, display a custom error message in the UI later.
                }
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Sign Up for an Account</h2>
                <SignUpStatus error={error} success={this.state.signUpSuccess} />
                {/* <Error error={error} /> */}
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
