import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const InputStyle = styled.div`
  .input-container {
    position: relative;
    margin-top: 30px;
    margin-right: 30px;
    margin-left: 30px;

    input,
    textarea {
      outline: none;
      z-index: 1;
      position: relative;
      background: none;
      width: 100%;
      height: 60px;
      border: 0;
      color: ${props => props.theme.white};
      font-size: 24px;
      font-weight: 400;

      &:focus {
        ~ label {
          color: ${props => props.theme.offWhite};
          transform: translate(-12%, -50%) scale(0.75);
        }

        ~ .bar {
          &:before,
          &:after {
            width: 50%;
          }
        }
      }
      &:valid {
        ~ label {
          color: ${props => props.theme.offWhite};
          transform: translate(-12%, -50%) scale(0.75);
        }
      }
    }

    textarea {
      resize: none;
      border: 1px solid #757575;
      margin-top: 25px;
      height: 120px;

      ~ label {
        margin-top: 25px;
      }

      &:focus {
        ~ label {
          margin-top: 25px;
          color: ${props => props.theme.offWhite};
          transform: translate(-12%, -75%) scale(0.75);
        }

        border: 2px solid ${props => props.theme.white};
      }

      &:valid {
        ~ label {
          color: ${props => props.theme.offWhite};
          transform: translate(-12%, -75%) scale(0.75);
        }
      }
    }

    label {
      position: absolute;
      top: 0;
      left: 0;
      color: ${props => props.theme.offWhite};
      opacity: 0.75;
      font-size: 24px;
      font-weight: 300;
      line-height: 60px;
      transition: 0.2s ease;
    }

    .bar {
      position: absolute;
      left: 0;
      bottom: 0;
      background: #757575;
      width: 100%;
      height: 1px;

      &:before,
      &:after {
        content: "";
        position: absolute;
        background: ${props => props.theme.white};
        width: 0;
        height: 2px;
        transition: 0.2s ease;
      }

      &:before {
        left: 50%;
      }

      &:after {
        right: 50%;
      }
    }
  }
`;

const CardInput = props => {
  const { type, name, id, value, defaultValue, onChange, placeholder } = props;
  const hasValue = value || value === "";
  const hasDefaultValue = defaultValue || defaultValue === "";
  return (
    <InputStyle>
      <div className="input-container">
        {type === "textarea" && hasValue && <textarea type={type} id={id} name={name} value={value} onChange={onChange} required />}
        {type === "textarea" && hasDefaultValue && <textarea type={type} id={id} name={name} defaultValue={defaultValue} onChange={onChange} required />}
        {type !== "textarea" && hasValue && <input type={type} id={id} name={name} value={value} onChange={onChange} required />}
        {type !== "textarea" && hasDefaultValue && <input type={type} id={id} name={name} defaultValue={defaultValue} onChange={onChange} required />}
        <label htmlFor={name}>{placeholder || name}</label>
        {type !== "textarea" && <div className="bar" />}
      </div>
    </InputStyle>
  );
};

CardInput.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string
};

export default CardInput;
