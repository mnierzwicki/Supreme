import React from "react";
import { Mutation, Query } from "react-apollo";
import gql from "graphql-tag";

import Form from "./styles/Form";
import Error from "./ErrorMessage";
import Success from "./SuccessMessage";
import Spinner from "./Spinner";
import CardStyles from "./styles/CardStyles";
import CardInput from "./styles/CardInput";
import CardButton from "./styles/CardButton";

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION($id: ID!, $title: String, $description: String, $price: Int) {
    updateItem(id: $id, title: $title, description: $description, price: $price) {
      id
      title
      description
      price
    }
  }
`;

class UpdateItem extends React.Component {
  state = {};

  handleChange = event => {
    const { name, type, value } = event.target;
    const val = type === "number" ? parseFloat(value) : value;
    this.setState({ [name.toLowerCase()]: val });
  };

  updateItem = async (event, updateItemMutation) => {
    // Stop from from submitting
    event.preventDefault();

    // Call the GraphQL mutation
    const resp = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state
      }
    });
  };

  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {({ data, loading, error }) => {
          if (loading) return <Spinner loading={loading} />;
          if (!data.item) return <p>No Item Found for ID: {this.props.id}</p>;
          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
              {(updateItem, { loading, error, called }) => (
                <Form onSubmit={e => this.updateItem(e, updateItem)}>
                  {error && <Error error={error} />}
                  {!error && !loading && called && <Success message={"Item updated"} />}

                  <CardStyles>
                    <div className="card">
                      <h1 className="title">Update Item</h1>
                      <fieldset disabled={loading} aria-busy={loading}>
                        <CardInput type="text" name="Title" defaultValue={data.item.title} onChange={this.handleChange} />
                        <CardInput type="number" name="Price" placeholder="Price (¢)" defaultValue={data.item.price.toString()} onChange={this.handleChange} />
                        <CardInput type="textarea" name="Description" defaultValue={data.item.description} onChange={this.handleChange} />

                        <CardButton text={loading ? "Updating..." : "Update"} />
                      </fieldset>
                    </div>
                  </CardStyles>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };
