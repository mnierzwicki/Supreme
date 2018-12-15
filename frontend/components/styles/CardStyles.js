import styled from "styled-components";

const CardStyles = styled.div`
  position: relative;
  max-width: 460px;
  width: 100%;
  font-family: "RobotoDraft", "Roboto", sans-serif;

  .card {
    position: relative;
    background: ${props => props.theme.maroon};
    border-radius: 5px;
    padding: 30px 0 30px 0;
    box-sizing: border-box;
    box-shadow: 1px 3px 3px 3px;
    transition: 0.3s ease;

    .title {
      position: relative;
      z-index: 1;
      border-left: 5px solid white;
      margin: 0 0 0px;
      padding: 10px 0px 10px 20px;
      color: white;
      font-size: 32px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .valid {
      label {
        transform: translate(-0%, -75%) scale(1);
      }
    }
  }
`;

export default CardStyles;
