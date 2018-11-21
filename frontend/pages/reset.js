import PasswordReset from "../components/PasswordReset";

const Reset = props => (
  <div>
    <PasswordReset resetToken={props.query.resetToken} />
  </div>
);

export default Reset;
