import RequireSignIn from "../components/RequireSignIn";
import OrderList from "../components/OrderList";

const OrdersPage = props => (
  <div>
    <RequireSignIn>
      <OrderList />
    </RequireSignIn>
  </div>
);

export default OrdersPage;
