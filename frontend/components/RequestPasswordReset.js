import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import { withAlert } from "react-alert";
import Form from "./styles/Form";
import Success from "./SuccessMessage";
import formatError from "../lib/formatError";

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

class RequestPasswordReset extends React.Component {
  state = {
    email: ""
  };

  saveToState = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <Mutation mutation={REQUEST_RESET_MUTATION} variables={this.state}>
        {(reset, { error, loading, called }) => (
          <Form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              await reset().catch(err => {
                this.props.alert.error(formatError(err));
              });
              this.setState({ email: "" });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Reset Password</h2>

              {!error && !loading && called && <Success message="Reset link sent to email" />}

              <label htmlFor="email">
                Email
                <input type="email" name="email" placeholder="email" value={this.state.email} onChange={this.saveToState} required />
              </label>
              <button type="submit">Reset</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default withAlert(RequestPasswordReset);
