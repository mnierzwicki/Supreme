import React from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { adopt } from "react-adopt";

import User from "./User";
import CartStyles from "./styles/CartStyles";
import Store from "./styles/Store";
import CloseButton from "./styles/CloseButton";
import StyledButton from "./styles/StyledButton";
import CartItem from "./CartItem";
import calcTotalPrice from "../lib/calcTotalPrice";
import formatMoney from "../lib/formatMoney";
import Checkout from "./Checkout";

const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client # @client - don't query server for results, this is a local query
  }
`;

const TOGGLE_CART_MUTATION = gql`
  mutation {
    toggleCart @client
  }
`;

const Composed = adopt({
  user: ({ render }) => <User>{render}</User>,
  toggleCart: ({ render }) => <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>,
  localState: ({ render }) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>
});

const Cart = () => (
  <Composed>
    {({ user, toggleCart, localState }) => {
      const me = user.data.me;
      if (!me) return null;
      return (
        <CartStyles open={localState.data.cartOpen}>
          <header>
            <CloseButton onClick={toggleCart} title="close">
              &times;
            </CloseButton>
            <Store>{me.name}'s Cart</Store>
            <p>{me.cart.length} unique items in cart</p>
          </header>

          <ul>
            {me.cart.map(cartItem => (
              <CartItem key={cartItem.id} cartItem={cartItem} />
            ))}
          </ul>

          <footer>
            <p>Total: {formatMoney(calcTotalPrice(me.cart))}</p>
            <Checkout>
              <StyledButton disabled={!me.cart.length}>Checkout</StyledButton>
            </Checkout>
          </footer>
        </CartStyles>
      );
    }}
  </Composed>
);

export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };
