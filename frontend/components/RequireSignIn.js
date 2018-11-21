import { Query } from "react-apollo";
import { CURRENT_USER_QUERY } from "./User";
import SignIn from "./SignIn";

const RequireSignIn = props => (
  <Query query={CURRENT_USER_QUERY}>
    {(payload, loading) => {
      if (loading) return <p>Loading...</p>;
      if (!payload.data.me) {
        return (
          <>
            <p>Sign in to sell items</p>
            <SignIn />
          </>
        );
      }
      return props.children;
    }}
  </Query>
);

export default RequireSignIn;
