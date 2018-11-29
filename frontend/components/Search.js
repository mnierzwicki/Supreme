import React from "react";
import Downshift, { resetIdCounter } from "downshift";
import Router from "next/router";
import { ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";
import debounce from "lodash.debounce";
import { DropDown, DropDownItem, SearchStyles } from "./styles/DropDown";

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchTerm: String!) {
    items(where: { OR: [{ title_contains: $searchTerm }, { description_contains: $searchTerm }] }) {
      id
      image
      title
    }
  }
`;

class AutoComplete extends React.Component {
  DEBOUNCE_TIMEOUT = 250; // ms

  state = {
    items: [],
    loading: false
  };

  routeToItem = item => {
    // Calling clearSelection() in downshift fires the onChange handler,
    // so prevent routing if there's no item (user is clearing their search)
    if (!item) return;

    Router.push({
      pathname: "/item",
      query: {
        id: item.id
      }
    });
  };

  onChange = debounce(async (e, client) => {
    // Prevent empty searches from returning all items
    if (e.target.value === "") {
      this.setState({ items: [] });
      return;
    }

    this.setState({ loading: true });

    // Manually query apollo client
    const response = await client.query({
      query: SEARCH_ITEMS_QUERY,
      variables: { searchTerm: e.target.value }
    });

    this.setState({
      items: response.data.items,
      loading: false
    });
  }, this.DEBOUNCE_TIMEOUT); // only call onChange once per DEBOUNCE_TIMEOUT millis

  render() {
    resetIdCounter();
    return (
      <SearchStyles>
        <Downshift onChange={this.routeToItem} itemToString={item => (item === null ? "" : item.title)}>
          {({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex, clearSelection }) => (
            <div>
              <ApolloConsumer>
                {client => (
                  <input
                    {...getInputProps({
                      type: "search",
                      placeholder: "🔍 Search items",
                      id: "search",
                      className: this.state.loading ? "loading" : "",
                      onChange: e => {
                        if (e.target.value === "") clearSelection();
                        e.persist();
                        this.onChange(e, client);
                      }
                    })}
                  />
                )}
              </ApolloConsumer>
              {isOpen && (
                <DropDown>
                  {this.state.items.map((item, index) => (
                    <DropDownItem {...getItemProps({ item })} key={item.id} highlighted={index === highlightedIndex}>
                      <img width="50" src={item.image} alt={item.title} />
                      {item.title}
                    </DropDownItem>
                  ))}
                  {!this.state.items.length && !this.state.loading && <DropDownItem>Nothing found for search "{inputValue}" </DropDownItem>}
                </DropDown>
              )}
            </div>
          )}
        </Downshift>
      </SearchStyles>
    );
  }
}

export default AutoComplete;
