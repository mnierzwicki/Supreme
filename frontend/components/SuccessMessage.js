import styled from "styled-components";
import React from "react";

const SuccessStyles = styled.div`
  padding: 2rem;
  background: white;
  margin: 2rem 0;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-left: 5px solid green;
  p {
    margin: 0;
    font-weight: 100;
  }
`;

const SuccessMessage = ({ message }) => {
  return (
    <SuccessStyles>
      <p>{message}</p>
    </SuccessStyles>
  );
};

export default SuccessMessage;
