import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import { withAlert } from "react-alert";

import Form from "./styles/Form";
import { PAGINATION_QUERY } from "./Pagination";
import { ALL_ITEMS_QUERY } from "./Items";
import formatError from "../lib/formatError";
import User from "./User";

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

  uploadFile = async event => {
    const files = event.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "Supreme-Shop");

    const resp = await fetch("https://api.cloudinary.com/v1_1/dayzgs2nn/image/upload/", {
      method: "POST",
      body: data
    });

    const file = await resp.json();
    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    });
  };

  render() {
    return (
      <User>
        {payload => {
          const me = payload.data.me;
          const hasPermission = me.permissions.some(permission => ["ADMIN", "ITEMCREATE"].includes(permission));
          if (!hasPermission) return <p>You don't have permission to create items!</p>;

          return (
            <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state} refetchQueries={[{ query: ALL_ITEMS_QUERY }, { query: PAGINATION_QUERY }]}>
              {(createItem, { error, loading, called }) => (
                <Form
                  onSubmit={async e => {
                    // Stop from from submitting
                    e.preventDefault();

                    // Call the GraphQL mutation
                    const resp = await createItem().catch(err => {
                      this.props.alert.error(formatError(err));
                    });

                    // Route to single item page
                    Router.push({
                      pathname: "/item",
                      query: { id: resp.data.createItem.id }
                    });
                  }}
                >
                  <fieldset disabled={loading} aria-busy={loading}>
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
                      <textarea
                        type="text"
                        id="description"
                        name="description"
                        placeholder="Enter a description"
                        value={this.state.description}
                        onChange={this.handleChange}
                        required
                      />
                    </label>

                    <label htmlFor="file">
                      Image
                      <input type="file" id="file" name="file" placeholder="Upload an image" onChange={this.uploadFile} required />
                    </label>

                    <button type="submit">Submit</button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }}
      </User>
    );
  }
}

export default withAlert(CreateItem);
export { CREATE_ITEM_MUTATION };
