import React from 'react';
import isPromise from 'is-promise';
import Converters from './Converters';
import Messages from './Messages';
import Validators from './Validators';

const propTypes = React.PropTypes;

class Form extends React.Component {

  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
    this.validationComponents = [];
  }

  getChildContext() {
    return {
      parentForm: this
    };
  }

  addValidationComponent(c) {
    this.validationComponents.push(c);
  }

  removeValidationComponent(c) {
    this.validationComponents = this.validationComponents.without(c);
  }

  // validate all child components
  // return array of { name, message }, empty if none
  validate() {
    const promises = this.validationComponents.map((c) => {
      var result = c.validate();
      return isPromise(result)? result : Promise.resolve(result);
    });
    return Promise.all(promises).then((results) => {
      return results.filter(result => result);
    });
  }

  onSubmit(e) {
    e.preventDefault();
    this.validate().then((results) => {
      !results.length && this.props.onSubmit(e);
    })
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
  onSubmit: propTypes.func.isRequired,

  // the state that will be injected into nested elements
  state: propTypes.object
}

Form.childContextTypes = {
  parentForm: propTypes.object
};

// component that will propagate any changes to state[props.name]
class BoundComponent extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.converter = props.converter || Converters[props.type] || Converters.text;
    const stateObject = this.getStateObject();
    this.state = {
      value: stateObject[props.name]
    }
    this.onChange = this.onChange.bind(this);
  }

  getStateObject() {
    return this.props.state || this.context.parentForm.props.state;
  }

  onChange(e) {
    const props = this.props;
    const onChange = props.onChange;
    const value = this.converter.toObject(e.target.value, props);
    this.setState({ value, errorMessage: undefined });
    this.getStateObject()[props.name] = value;
    onChange && onChange(e);
  }

  componentDidMount() {
    this.context.parentForm.addValidationComponent(this);
  }

  componentWillUnmount() {
    this.context.parentForm.removeValidationComponent(this);
  }

  validate() {
    const allProps = this.props;
    const validationProps = Validators.filterValidationProps(allProps);
    let message = undefined;
    Object.keys(validationProps).find((prop) => {
      const validator = Validators[allProps.type + '.' + prop] || Validators[prop];
      if (validator) {
        return (message = validator(this.state.value, allProps));
      } 
    });
    if (message) {
      this.setState({ errorMessage : message });
    }
    return message;
  }

  render() {
    const value = this.converter.toString(this.state.value);
    const errorMessage = this.state.errorMessage? <div className="input-error">{ this.state.errorMessage }</div> : undefined;
    const { state, onChange, ...props } = this.props;
    props.value = value;
    props.onChange = this.onChange;
    const element = React.createElement(this.getNestedElementClass(), props, props.children);
    return <div className="input-wrapper">{ element }{errorMessage}</div>;
  }

}

BoundComponent.propTypes = {
  // name of the input field. Will be used to set the value into the state object
  name: propTypes.string.isRequired,

  // the state from the parent Form can be overriden at the element level
  state: propTypes.object
}

BoundComponent.contextTypes = {
  parentForm: propTypes.object.isRequired
};

function createBoundComponent(NestedElementClass) {
  return class GeneratedClass extends BoundComponent {
    getNestedElementClass() {
      return NestedElementClass;
    }
  }
}

class Input extends BoundComponent {
  getNestedElementClass() {
    return 'input';
  }
}
Input.propTypes = {
  type: propTypes.string.isRequired
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

export { Form, Input, TextArea, Select };
