import React from "react";
import { withAlert } from "react-alert";

import formatError from "../lib/formatError";

class ErrorMessage extends React.Component {
  componentDidMount() {
    this.props.alert.error(formatError(this.props.error));
  }

  render() {
    return null;
  }
}

export default withAlert(ErrorMessage);
