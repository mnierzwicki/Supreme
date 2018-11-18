import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";

import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import Error from "./ErrorMessage";

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION($title: String!, $description: String!, $price: Int!, $image: String, $largeImage: String) {
    createItem(title: $title, description: $description, price: $price, image: $image, largeImage: $largeImage) {
      id
    }
  }
`;

class CreateItem extends React.Component {
  state = {
    title: "",
    description: "",
    image: "",
    largeImage: "",
    price: 0
  };

  handleChange = event => {
    const { name, type, value } = event.target;
    const val = type === "number" ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, payload) => (
          <Form
            onSubmit={async e => {
              // Stop from from submitting
              e.preventDefault();

              // Call the GraphQL mutation
              const resp = await createItem();

              // Route to single item page
              Router.push({
                pathname: "/item",
                query: { id: resp.data.createItem.id }
              });
            }}
          >
            <Error error={payload.error} />
            <fieldset disabled={payload.loading} aria-busy={payload.loading}>
              <label htmlFor="title">
                Title
                <input type="text" id="title" name="title" placeholder="Title" value={this.state.title} onChange={this.handleChange} required />
              </label>

              <label htmlFor="price">
                Price
                <input type="number" id="price" name="price" placeholder="Price" value={this.state.price} onChange={this.handleChange} required />
              </label>

              <label htmlFor="description">
                Description
                <textarea type="text" id="description" name="description" placeholder="Enter a description" value={this.state.description} onChange={this.handleChange} required />
              </label>

              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
