import styled from "styled-components";

import SignUp from "../components/SignUp";
import SignIn from "../components/SignIn";
import RequestPasswordReset from "../components/RequestPasswordReset";

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const SignInPage = props => (
  <Columns>
    <SignUp />
    <SignIn />
    <RequestPasswordReset />
  </Columns>
);

export default SignInPage;
