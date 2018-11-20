import Link from "next/link";
import NavStyles from "./styles/NavStyles";
import User from "./User";

const Nav = () => (
  <NavStyles>
    <User>
      {payload => {
        const { data } = payload;
        const { me } = data;
        if (me) return <p>{me.name}</p>;
        return null;
      }}
    </User>
    <Link href="/shop">
      <a>Shop</a>
    </Link>
    <Link href="/sell">
      <a>Sell</a>
    </Link>
    <Link href="/signup">
      <a>Signup</a>
    </Link>
    <Link href="/orders">
      <a>Orders</a>
    </Link>
    <Link href="/account">
      <a>Account</a>
    </Link>
  </NavStyles>
);

export default Nav;
