import CreateItem from "../components/CreateItem";
import RequireSignIn from "../components/RequireSignIn";

const Sell = props => (
  <div>
    <RequireSignIn>
      <CreateItem />
    </RequireSignIn>
  </div>
);

export default Sell;
