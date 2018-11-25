import Link from "next/link";
import { Mutation } from "react-apollo";

import NavStyles from "./styles/NavStyles";
import User from "./User";
import SignOut from "./SignOut";
import { TOGGLE_CART_MUTATION } from "../components/Cart";

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
              <Link href="/sell">
                <a>Sell</a>
              </Link>
              <Link href="/orders">
                <a>Orders</a>
              </Link>
              <Link href="/account">
                <a>Account</a>
              </Link>
              <SignOut />
              <Mutation mutation={TOGGLE_CART_MUTATION}>{toggleCart => <button onClick={toggleCart}>🛒</button>}</Mutation>
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
