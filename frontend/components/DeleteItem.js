import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { withAlert } from "react-alert";

import { ALL_ITEMS_QUERY } from "./Items";
import { CURRENT_USER_QUERY } from "./User";
import { PAGINATION_QUERY } from "./Pagination";
import formatError from "../lib/formatError";

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

class DeleteItem extends React.Component {
  update = (cache, payload) => {
    // manually update cache on the client so it's in sync with the backend

    // Read the cache for the items we want
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });

    // Filter deleted item out of the page
    data.items = data.items.filter(item => item.id !== payload.data.deleteItem.id);

    // Put the items back
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  };

  render() {
    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{ id: this.props.id }}
        update={this.update}
        refetchQueries={[{ query: CURRENT_USER_QUERY }, { query: ALL_ITEMS_QUERY }, { query: PAGINATION_QUERY }]}
      >
        {(deleteItem, { error }) => (
          <button
            onClick={() => {
              if (confirm("Are you sure you want to delete item?")) {
                deleteItem().catch(err => {
                  this.props.alert.error(formatError(err));
                });
              }
            }}
          >
            {this.props.children}
          </button>
        )}
      </Mutation>
    );
  }
}

export default withAlert(DeleteItem);
