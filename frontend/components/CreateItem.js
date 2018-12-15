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
import CardStyles from "./styles/CardStyles";
import CardInput from "./styles/CardInput";
import CardButton from "./styles/CardButton";
import FileInputButton from "./styles/FileInputButton";

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
    price: ""
  };

  handleChange = event => {
    const { name, type, value } = event.target;
    if (value) {
      const val = type === "number" ? parseFloat(value) : value;
      this.setState({ [name.toLowerCase()]: val });
    } else {
      this.setState({ [name.toLowerCase()]: "" });
    }
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
                  <CardStyles>
                    <div className="card">
                      <h1 className="title">Sell Item</h1>
                      <fieldset disabled={loading} aria-busy={loading}>
                        <CardInput type="text" name="Title" value={this.state.title} onChange={this.handleChange} />
                        <CardInput type="number" name="Price" value={this.state.price.toString()} placeholder="Price (¢)" onChange={this.handleChange} />
                        <CardInput type="textarea" name="Description" value={this.state.description} onChange={this.handleChange} />

                        <FileInputButton callback={this.uploadFile} />

                        <CardButton text="Sell" />
                      </fieldset>
                    </div>
                  </CardStyles>
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
