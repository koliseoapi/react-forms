import React from 'react';
import PropTypes from 'prop-types';

// Form is the (optional) container of BoundComponent instances.
export default class Form extends React.Component {

  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
    this.validationComponents = [];
  }

  getChildContext() {
    return {
      form: this
    };
  }

  addValidationComponent(c) {
    this.validationComponents.push(c);
  }

  removeValidationComponent(c) {
    const vc = this.validationComponents;
    const index = vc.indexOf(c);
    index !== -1 && vc.splice(index, 1);
  }

  // validate all child components
  // @return a Promise that resolves to true if validation passes for all fields, false otherwise
  validate() {
    const promises = this.validationComponents.map(c => c.validate());
    return Promise.all(promises).then(errorMessages => {
      return errorMessages.every(errorMessage => !errorMessage);
    });
  }

  // if all validations pass, invokes the onSubmit callback
  // @return a Promise to be invoked after the validation is done
  onSubmit(e) {
    e.preventDefault();
    return this.validate().then((results) => {
      results && this.props.onSubmit(e);
    });
  }

  render() {
    const { state, ...props } = this.props;
    return (
      <form {...props} onSubmit={this.onSubmit} noValidate>
        {this.props.children}
      </form>
    )  
  }
}

Form.propTypes = {
  // the callback that will be invoked on submit, if validation passes
  onSubmit: PropTypes.func.isRequired,

  // the state that will be injected into nested elements
  state: PropTypes.object
}

Form.childContextTypes = {
  form: PropTypes.object
};

