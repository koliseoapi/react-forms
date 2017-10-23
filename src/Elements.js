import React from 'react';
import PropTypes from 'prop-types';
import BoundComponent from './BoundComponent';

class Input extends BoundComponent {
  getNestedElementClass() {
    return 'input';
  }
}

Input.propTypes = {
  type: PropTypes.string.isRequired
}

class TextArea extends BoundComponent {
  getNestedElementClass() {
    return 'textarea';
  }
}

class Select extends BoundComponent {
  getNestedElementClass() {
    return 'select';
  }
}

export { Input, TextArea, Select };
