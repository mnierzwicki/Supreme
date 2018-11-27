import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import Form from "./styles/Form";
import Error from "./ErrorMessage";
import Success from "./SuccessMessage";
import { CURRENT_USER_QUERY } from "./User";

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

class SignIn extends React.Component {
  state = {
    password: "",
    email: ""
  };

  saveToState = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <Mutation mutation={SIGNIN_MUTATION} variables={this.state} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
        {(signin, { error, loading, called }) => (
          <Form
            method="post"
            onSubmit={async event => {
              event.preventDefault();
              await signin();
              this.setState({ name: "", email: "", password: "" });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Login</h2>

              {error && <Error error={error} />}
              {!error && !loading && called && <Success message={"Logged in!"} />}

              <label htmlFor="email">
                Email
                <input type="email" name="email" placeholder="email" value={this.state.email} onChange={this.saveToState} />
              </label>
              <label htmlFor="password">
                Password
                <input type="password" name="password" placeholder="password" value={this.state.password} onChange={this.saveToState} />
              </label>
              <button type="submit">Login</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default SignIn;
