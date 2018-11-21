import Link from "next/link";

import NavStyles from "./styles/NavStyles";
import User from "./User";
import SignOut from "./SignOut";

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
