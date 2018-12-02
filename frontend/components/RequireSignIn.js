import { Query } from "react-apollo";

import { CURRENT_USER_QUERY } from "./User";
import SignIn from "./SignIn";
import Spinner from "./Spinner";

const RequireSignIn = props => (
  <Query query={CURRENT_USER_QUERY}>
    {(payload, loading) => {
      if (loading) return <Spinner loading={loading} />;
      if (!payload.data.me) {
        return <SignIn />;
      }
      return props.children;
    }}
  </Query>
);

export default RequireSignIn;
