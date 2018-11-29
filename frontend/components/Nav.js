import Link from "next/link";
import { Mutation } from "react-apollo";

import NavStyles from "./styles/NavStyles";
import User from "./User";
import SignOut from "./SignOut";
import { TOGGLE_CART_MUTATION } from "./Cart";
import CartCount from "./CartCount";

const Nav = () => (
  <User>
    {payload => {
      const { data } = payload;
      const { me } = data;

      return (
        <NavStyles>
          <Link href="/">
            <a>Shop</a>
          </Link>

          {me && (
            <>
              {me.permissions.some(permission => ["ADMIN", "ITEMCREATE"].includes(permission)) && (
                <Link href="/sell">
                  <a>Sell</a>
                </Link>
              )}
              <Link href="/orders">
                <a>Orders</a>
              </Link>
              {me.permissions.some(permission => ["ADMIN", "PERMISSIONUPDATE"].includes(permission)) && (
                <Link href="/permissions">
                  <a>Permissions</a>
                </Link>
              )}
              <SignOut />
              <Mutation mutation={TOGGLE_CART_MUTATION}>
                {toggleCart => (
                  <button onClick={toggleCart}>
                    🛒 <CartCount count={me.cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0)} />
                  </button>
                )}
              </Mutation>
            </>
          )}

          {!me && (
            <Link href="/signin">
              <a>Sign In</a>
            </Link>
          )}
        </NavStyles>
      );
    }}
  </User>
);

export default Nav;
