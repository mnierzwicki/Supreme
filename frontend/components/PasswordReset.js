import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import PropTypes from "prop-types";

import Error from "./ErrorMessage";
import Form from "./styles/Form";
import Success from "./SuccessMessage";
import { CURRENT_USER_QUERY } from "./User";

const PASSWORD_RESET_MUTATION = gql`
  mutation PASSWORD_RESET_MUTATION($resetToken: String!, $password: String!, $confirmPassword: String!) {
    resetPassword(resetToken: $resetToken, password: $password, confirmPassword: $confirmPassword) {
      id
      name
      email
    }
  }
`;

class PasswordReset extends React.Component {
  static propTypes = {
    resetToken: PropTypes.string.isRequired
  };

  state = {
    password: "",
    confirmPassword: ""
  };

  saveToState = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <Mutation
        mutation={PASSWORD_RESET_MUTATION}
        variables={{
          resetToken: this.props.resetToken,
          password: this.state.password,
          confirmPassword: this.state.confirmPassword
        }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(reset, { error, loading, called }) => (
          <Form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              await reset();
              this.setState({ password: "", confirmPassword: "" });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Reset password</h2>

              {error && <Error error={error} />}
              {!error && !loading && called && <Success message={"Successfully changed password"} />}

              <label htmlFor="password">
                New password
                <input type="password" name="password" placeholder="password" value={this.state.password} onChange={this.saveToState} required />
              </label>
              <label htmlFor="confirmPassword">
                Confirm New password
                <input type="password" name="confirmPassword" placeholder="Confirm password" value={this.state.confirmPassword} onChange={this.saveToState} required />
              </label>
              <button type="submit">Reset</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default PasswordReset;
