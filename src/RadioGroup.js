import React from 'react';
import PropTypes from 'prop-types';

// RadioGroup is the (required) container of Input[type=radio] instances.
export default class RadioGroup extends React.Component {

  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  getChildContext() {
    return {
      radioGroup: this
    };
  }

  onChange() {
    this.forceUpdate();
  }

  render() {
    const { children, ...props } = this.props;
    if (children.length !== 1) {
      return <div {...props}>{children}</div>
    } else {
      return children[0];
    }
  }

}

RadioGroup.childContextTypes = {
  radioGroup: PropTypes.object
};

