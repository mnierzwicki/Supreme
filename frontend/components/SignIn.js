import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { withAlert } from "react-alert";

import Form from "./styles/Form";
import formatError from "../lib/formatError";
import Success from "./SuccessMessage";
import { CURRENT_USER_QUERY } from "./User";
import { USER_ORDERS_QUERY } from "./OrderList";

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
      <Mutation mutation={SIGNIN_MUTATION} variables={this.state} refetchQueries={[{ query: CURRENT_USER_QUERY }, { query: USER_ORDERS_QUERY }]}>
        {(signin, { error, loading, called }) => (
          <Form
            method="post"
            onSubmit={async event => {
              event.preventDefault();
              await signin().catch(err => {
                this.props.alert.error(formatError(err));
              });
              this.setState({ name: "", email: "", password: "" });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Login</h2>

              {!error && !loading && called && <Success message={"Logged in!"} />}

              <label htmlFor="email">
                Email
                <input type="email" name="email" placeholder="email" value={this.state.email} onChange={this.saveToState} required />
              </label>
              <label htmlFor="password">
                Password
                <input type="password" name="password" placeholder="password" value={this.state.password} onChange={this.saveToState} required />
              </label>
              <button type="submit">Login</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default withAlert(SignIn);
