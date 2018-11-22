import RequireSignIn from "../components/RequireSignIn";
import Permissions from "../components/Permissions";

const PermissionsPage = props => (
  <div>
    <RequireSignIn>
      <Permissions />
    </RequireSignIn>
  </div>
);

export default PermissionsPage;
