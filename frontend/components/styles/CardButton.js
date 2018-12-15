import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const ButtonStyle = styled.div`
  .button-container {
    margin-top: 60px;
    margin-bottom: 10px;
    text-align: center;

    button {
      outline: 0;
      cursor: pointer;
      position: relative;
      display: inline-block;
      background: 0;
      width: 240px;
      border: 2px solid ${props => props.theme.white};
      padding: 20px 0;
      font-size: 24px;
      font-weight: 600;
      line-height: 1;
      text-transform: uppercase;
      overflow: hidden;
      transition: 0.3s ease;

      span {
        position: relative;
        z-index: 1;
        color: ${props => props.theme.white};
        transition: 0.3s ease;
      }

      &:before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        display: block;
        background: ${props => props.theme.white};
        width: 30px;
        height: 30px;
        border-radius: 100%;
        margin: -15px 0 0 -15px;
        opacity: 0;
        transition: 0.3s ease;
      }

      &:hover,
      &:active,
      &:focus {
        span {
          color: ${props => props.theme.maroon};
        }

        &:before {
          opacity: 1;
          transform: scale(10);
        }
      }
    }
  }
`;

const CardButton = props => {
  const { text } = props;
  return (
    <ButtonStyle>
      <div className="button-container">
        <button type="submit">
          <span>{text}</span>
        </button>
      </div>
    </ButtonStyle>
  );
};

CardButton.propTypes = {
  text: PropTypes.string.isRequired
};

export default CardButton;
