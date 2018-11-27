import RequireSignIn from "../components/RequireSignIn";
import Order from "../components/Order";

const OrderPage = props => (
  <div>
    <RequireSignIn>
      <Order id={props.query.id} />
    </RequireSignIn>
  </div>
);

export default OrderPage;
