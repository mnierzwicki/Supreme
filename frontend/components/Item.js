import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";

import Title from "./styles/Title";
import ItemStyles from "./styles/ItemStyles";
import PriceTag from "./styles/PriceTag";
import formatMoney from "../lib/formatMoney";
import DeleteItem from "./DeleteItem";
import AddToCart from "./AddToCart";
import User from "./User";

class Item extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired
  };

  hasPermissions = (user, item, requiredPermissions) => {
    const hasPermission = user.permissions.some(permission => requiredPermissions.includes(permission));
    const ownsItem = user.id === item.user.id;
    return hasPermission || ownsItem;
  };

  render() {
    const item = this.props.item;
    return (
      <User>
        {payload => {
          const { data } = payload;
          const { me } = data;

          return (
            <ItemStyles>
              {item.image && <img src={item.image} alt={item.title} title={item.title} />}
              <Title>
                <Link
                  href={{
                    pathname: "/item",
                    query: { id: item.id }
                  }}
                >
                  <a>{item.title}</a>
                </Link>
              </Title>
              <PriceTag>{formatMoney(item.price)}</PriceTag>
              <p>{item.description}</p>

              <div className="buttonList">
                {me && this.hasPermissions(me, item, ["ADMIN", "ITEMUPDATE"]) && (
                  <Link
                    href={{
                      pathname: "update",
                      query: { id: item.id }
                    }}
                  >
                    <a>Edit ✏️</a>
                  </Link>
                )}

                {me && <AddToCart id={item.id} />}
                {me && this.hasPermissions(me, item, ["ADMIN", "ITEMDELETE"]) && <DeleteItem id={item.id}>Delete ❌</DeleteItem>}
              </div>
            </ItemStyles>
          );
        }}
      </User>
    );
  }
}

export default Item;
