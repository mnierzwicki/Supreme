import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import CardStyles from "./styles/CardStyles";
import CardInput from "./styles/CardInput";
import CardButton from "./styles/CardButton";
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

class ForgotPassword extends React.Component {
  state = {
    email: ""
  };

  saveToState = event => {
    const { name, value } = event.target;
    this.setState({ [name.toLowerCase()]: value });
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
            <CardStyles>
              <div className="card">
                <h1 className="title">Locked Out?</h1>
                <fieldset disabled={loading} aria-busy={loading}>
                  {!error && !loading && called && <Success message="Reset link sent to email" />}

                  <CardInput type="text" name="Email" id="forgot-password-email" value={this.state.email} onChange={this.saveToState} />
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

export default withAlert(ForgotPassword);
