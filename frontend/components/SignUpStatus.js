import React from "react";

const SignUpStatus = ({ error, success }) => {
  if (error) return <p>Error during sign up</p>;
  if (success) return <p>Sign up successful!</p>;

  return null;
};

export default SignUpStatus;
