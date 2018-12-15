import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import PropTypes from "prop-types";

import Error from "./ErrorMessage";
import Form from "./styles/Form";
import Success from "./SuccessMessage";
import { CURRENT_USER_QUERY } from "./User";
import CardStyles from "./styles/CardStyles";
import CardInput from "./styles/CardInput";
import CardButton from "./styles/CardButton";

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
    const { name, value } = event.target;
    this.setState({ [name]: value });
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
            <CardStyles>
              <div className="card">
                <h1 className="title">Reset Password</h1>
                <fieldset disabled={loading} aria-busy={loading}>
                  {error && <Error error={error} />}
                  {!error && !loading && called && <Success message={"Password changed!"} />}

                  <CardInput type="password" name="password" placeholder="Password" id="password-reset-password" value={this.state.password} onChange={this.saveToState} />
                  <CardInput
                    type="password"
                    name="confirmPassword"
                    id="password-reset-confirm-password"
                    placeholder="Confirm Password"
                    value={this.state.confirmPassword}
                    onChange={this.saveToState}
                  />
                  <CardButton text="Reset" />
                </fieldset>
              </div>
            </CardStyles>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default PasswordReset;
