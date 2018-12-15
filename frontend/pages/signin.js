import styled from "styled-components";

import SignUp from "../components/SignUp";
import SignIn from "../components/SignIn";
import ForgotPassword from "../components/ForgotPassword";

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const SignInPage = props => (
  <Columns>
    <SignIn />
    <SignUp />
    <ForgotPassword />
  </Columns>
);

export default SignInPage;
