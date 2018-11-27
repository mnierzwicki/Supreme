import styled from "styled-components";

const SickButton = styled.button`
  background: ${props => props.theme.orange};
  color: white;
  font-weight: 500;
  border: 0;
  border-radius: 0;
  text-transform: uppercase;
  font-size: 2rem;
  padding: 0.8rem 1.5rem;
  transition: all 0.5s;
  float: right;
  &[disabled] {
    opacity: 0.5;
  }
`;

export default SickButton;
