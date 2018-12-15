import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { withAlert } from "react-alert";

import Form from "./styles/Form";
import formatError from "../lib/formatError";
import Success from "./SuccessMessage";
import { CURRENT_USER_QUERY } from "./User";
import { USER_ORDERS_QUERY } from "./OrderList";
import CardStyles from "./styles/CardStyles";
import CardInput from "./styles/CardInput";
import CardButton from "./styles/CardButton";

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

class Login extends React.Component {
  state = {
    password: "",
    email: ""
  };

  saveToState = event => {
    const { name, value } = event.target;
    this.setState({ [name.toLowerCase()]: value });
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
              this.setState({ email: "", password: "" });
            }}
          >
            <CardStyles>
              <div className="card">
                <h1 className="title">Sign In</h1>
                <fieldset disabled={loading} aria-busy={loading}>
                  {!error && !loading && called && <Success message={"Logged in!"} />}

                  <CardInput type="text" name="Email" id="sign-in-email" value={this.state.email} onChange={this.saveToState} />
                  <CardInput type="password" name="Password" id="sign-in-password" value={this.state.password} onChange={this.saveToState} />
                  <CardButton text="Login" />
                </fieldset>
              </div>
            </CardStyles>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default withAlert(Login);
