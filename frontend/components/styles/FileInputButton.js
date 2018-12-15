import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const Style = styled.div`
  margin-top: 30px;
  text-align: center;

  input {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }

  input,
  label {
    font-size: 1.25em;
    font-weight: 700;
    color: ${props => props.theme.offWhite};
    display: inline-block;
    cursor: pointer;
    outline: 1px solid #757575;
  }

  input:focus,
  label:hover {
    outline: 1px solid ${props => props.theme.white};
    color: ${props => props.theme.white};
  }
`;

class FileInputButton extends React.Component {
  static propTypes = {
    callback: PropTypes.func.isRequired
  };

  state = {
    message: "Upload an Image"
  };

  update = event => {
    const files = event.target.files;
    const file = files[0];

    this.setState({ message: file.name });
    this.props.callback(event);
  };

  render() {
    return (
      <Style>
        <label htmlFor="file">{this.state.message}</label>
        <input type="file" id="file" name="file" className="inputfile" onChange={this.update} required />
      </Style>
    );
  }
}

export default FileInputButton;
