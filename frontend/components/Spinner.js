import React from "react";
import { ClipLoader } from "react-spinners";
import styled from "styled-components";

// For some reason, overriding className on ClipLoader doesn't
// allow our custom styles to be applied correctly.
// After digging into this more, it appears that emotion/webpack
// are writing our custom styles to the DOM first, followed by the
// default styles for ClipLoader. This causes ClipLoader's default
// `display: inline-block` to override our custom setting of `display: block`
// (to center the spinner element on the page). To get around this issue,
// use a div wrapper with `text-align: center` to center the spinner instead.
const Wrapper = styled.div`
  text-align: center;
`;

class Spinner extends React.Component {
  render() {
    return (
      <Wrapper>
        <ClipLoader sizeUnit={"px"} size={70} color={"#E87722"} loading={this.props.loading} />
      </Wrapper>
    );
  }
}

export default Spinner;
