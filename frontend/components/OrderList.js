import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { formatDistance } from "date-fns";
import Link from "next/link";
import styled from "styled-components";

import formatMoney from "../lib/formatMoney";
import OrderItemStyles from "./styles/OrderItemStyles";
import Error from "./ErrorMessage";

const USER_ORDERS_QUERY = gql`
  query USER_ORDERS_QUERY {
    orders(orderBy: createdAt_DESC) {
      id
      total
      createdAt
      items {
        id
        title
        quantity
        image
      }
    }
  }
`;

const OrderUl = styled.ul`
  display: grid;
  grid-gap: 4rem;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
`;

const OrderHeader = styled.h2`
  text-align: center;
`;

class OrderList extends React.Component {
  render() {
    return (
      <div>
        <Query query={USER_ORDERS_QUERY}>
          {({ data, error, loading }) => {
            if (error) return <Error error={error} />;
            if (loading) return <p>Loading...</p>;
            const orders = data.orders;
            return (
              <div>
                <OrderHeader>You have {orders.length} orders</OrderHeader>
                <OrderUl>
                  {orders.map(order => (
                    <OrderItemStyles key={order.id}>
                      <Link
                        href={{
                          pathname: "/order",
                          query: { id: order.id }
                        }}
                      >
                        <a>
                          <div className="order-meta">
                            <p>Item(s): {order.items.reduce((tally, item) => tally + item.quantity, 0)}</p>
                            <p>{formatDistance(order.createdAt, new Date())}</p>
                            <p>{formatMoney(order.total)}</p>
                          </div>
                          <div className="images">
                            {order.items.map(item => (
                              <img key={item.id} src={item.image} alt={item.title} title={item.title} />
                            ))}
                          </div>
                        </a>
                      </Link>
                    </OrderItemStyles>
                  ))}
                </OrderUl>
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default OrderList;
export { USER_ORDERS_QUERY };
