import React from "react";
import { Mutation } from "react-apollo";
import styled from "styled-components";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { CURRENT_USER_QUERY } from "./User";

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

const Button = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${props => props.theme.orange};
    cursor: pointer;
  }
`;

class RemoveFromCart extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  };

  // Method called twice on item removal:
  // First call is immediately after a user attemps to
  // remove an item via optimisticReponse.
  // Second call is after we receive the server response
  update = (cache, payload) => {
    // Read the cache
    const data = cache.readQuery({ query: CURRENT_USER_QUERY });

    // Remove item from the cart
    const removedCartItemId = payload.data.removeFromCart.id;
    data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== removedCartItemId);

    // Write the deletion back to the cache
    cache.writeQuery({ query: CURRENT_USER_QUERY, data: data });
  };

  render() {
    return (
      <Mutation
        mutation={REMOVE_FROM_CART_MUTATION}
        variables={{ id: this.props.id }}
        update={this.update}
        optimisticResponse={{
          __typename: "Mutation",
          removeFromCart: {
            __typename: "CartItem",
            id: this.props.id
          }
        }}
      >
        {(removeFromCart, { loading, error }) => (
          <Button
            disabled={loading}
            title="Remove item"
            onClick={() => {
              removeFromCart().catch(err => alert(err.message));
            }}
          >
            &times;
          </Button>
        )}
      </Mutation>
    );
  }
}

export default RemoveFromCart;
