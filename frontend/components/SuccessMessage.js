import React from "react";
import { withAlert } from "react-alert";

class SuccessMessage extends React.Component {
  componentDidMount() {
    this.props.alert.success(this.props.message);
  }

  render() {
    return null;
  }
}

export default withAlert(SuccessMessage);
