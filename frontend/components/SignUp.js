import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { withAlert } from "react-alert";

import CardStyles from "./styles/CardStyles";
import CardInput from "./styles/CardInput";
import CardButton from "./styles/CardButton";
import formatError from "../lib/formatError";
import Form from "./styles/Form";
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
    const { name, value } = event.target;
    this.setState({ [name.toLowerCase()]: value });
  };

  render() {
    return (
      <Mutation mutation={SIGNUP_MUTATION} variables={this.state} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
        {(signup, { error, loading, called }) => (
          <Form
            method="post"
            onSubmit={async event => {
              event.preventDefault();
              try {
                await signup().catch(err => {
                  this.props.alert.error(formatError(err));
                });
                this.setState({ name: "", email: "", password: "" });
              } catch (error) {
                // Prevent GraphQL from displaying error message to console.log
                // Instead, display a custom error message in the UI later.
              }
            }}
          >
            <CardStyles>
              <div className="card">
                <h1 className="title">Sign Up</h1>
                <fieldset disabled={loading} aria-busy={loading}>
                  {!error && !loading && called && <Success message={"Logged in!"} />}

                  <CardInput type="text" name="Email" id="sign-up-email" value={this.state.email} onChange={this.saveToState} />
                  <CardInput type="text" name="Name" id="sign-up-name" value={this.state.name} onChange={this.saveToState} />
                  <CardInput type="password" name="Password" id="sign-up-password" value={this.state.password} onChange={this.saveToState} />
                  <CardButton text="Sign Up" />
                </fieldset>
              </div>
            </CardStyles>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default withAlert(SignUp);
