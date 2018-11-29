import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Head from "next/head";
import Link from "next/link";

import PaginationStyles from "./styles/PaginationStyles";
import { perPage } from "../config";

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

const Pagination = props => (
  <Query query={PAGINATION_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return null;
      const count = data.itemsConnection.aggregate.count;
      const pages = Math.max(Math.ceil(count / perPage), 1);
      const page = props.page;
      return (
        <PaginationStyles>
          <Head>
            <title>
              Store | Page {page} of {pages}
            </title>
          </Head>
          <Link
            prefetch
            href={{
              pathname: "items",
              query: { page: page - 1 }
            }}
          >
            <a className="prev" aria-disabled={page <= 1}>
              ← Prev
            </a>
          </Link>

          <p>
            Page {page} of {pages}
          </p>

          <p>{count} Items</p>

          <Link
            prefetch
            href={{
              pathname: "items",
              query: { page: page + 1 }
            }}
          >
            <a className="next" aria-disabled={page >= pages}>
              Next →
            </a>
          </Link>
        </PaginationStyles>
      );
    }}
  </Query>
);

export default Pagination;
export { PAGINATION_QUERY };
