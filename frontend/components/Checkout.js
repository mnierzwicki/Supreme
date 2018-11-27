import React from "react";
import StripeCheckout from "react-stripe-checkout";
import { Mutation } from "react-apollo";
import Router from "next/router";
import NProgress from "nprogress";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { withAlert } from "react-alert";

import User, { CURRENT_USER_QUERY } from "./User";
import calcTotalPrice from "../lib/calcTotalPrice";
import { STRIPE_PUB_KEY } from "../config";

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

function totalItems(cart) {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
}

class Checkout extends React.Component {
  onToken = async (resp, createOrder) => {
    NProgress.start();

    // manually call mutation once we have the stripe token
    const order = await createOrder({
      variables: {
        token: resp.id
      }
    }).catch(err => {
      this.props.alert.error(err.message);
    });

    this.props.alert.success("Order processed!");

    Router.push({
      pathname: "/order",
      query: { id: order.data.createOrder.id }
    });
  };

  render() {
    return (
      <User>
        {({ data: { me } }) =>
          me && (
            <Mutation mutation={CREATE_ORDER_MUTATION} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
              {createOrder => (
                <StripeCheckout
                  amount={calcTotalPrice(me.cart)}
                  name="Supreme Store"
                  description={`Order of ${totalItems(me.cart)} total items`}
                  stripeKey={STRIPE_PUB_KEY}
                  currency="USD"
                  email={me.email}
                  token={resp => this.onToken(resp, createOrder)}
                >
                  {this.props.children}
                </StripeCheckout>
              )}
            </Mutation>
          )
        }
      </User>
    );
  }
}

export default withAlert(Checkout);
