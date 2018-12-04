import React from "react";
import styled from "styled-components";

const StyledFooter = styled.footer`
  position: absolute;
  width: 100%;
  height: 2.5rem;
  bottom: 0;
  font-size: 1.25rem;
  text-align: center;
  border-top: 1px solid ${props => props.theme.lightGrey};
  overflow: hidden;
  p {
    margin-top: 0px;
  }
  a {
    color: blue;
    border-bottom: 1px solid black;
  }
`;

const Footer = () => (
  <StyledFooter>
    <p>
      View the code on <a href="https://github.com/mnierzwicki/Supreme">Github</a>!
    </p>
  </StyledFooter>
);

export default Footer;
