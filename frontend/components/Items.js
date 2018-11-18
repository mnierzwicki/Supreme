import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";

import Item from "./Item";

const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY {
    items {
      id
      title
      price
      description
      image
      largeImage
    }
  }
`;

const Center = styled.div`
  text-align: center;
`;

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`;

class Items extends React.Component {
  render() {
    return (
      <Center>
        <p>Items!</p>
        <Query query={ALL_ITEMS_QUERY}>
          {payload => {
            if (payload.loading) return <p>Loading...</p>;
            if (payload.error) return <p>Error: {payload.error.message}</p>;
            return (
              <ItemsList>
                {payload.data.items.map(item => (
                  <Item key={item.id} item={item} />
                ))}
              </ItemsList>
            );
          }}
        </Query>
      </Center>
    );
  }
}

export default Items;
export { ALL_ITEMS_QUERY };
