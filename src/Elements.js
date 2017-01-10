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
    this.valueProp = props.type === 'checkbox'? 'checked' : 'value';
  }

  getStateObject() {
    return this.props.state || this.context.parentForm.props.state;
  }

  onChange(e) {
    const props = this.props;
    const onChange = props.onChange;
    const value = this.converter.toObject(e.target[this.valueProp], props);
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

  // launch the custom validation from props.validator
  customValidation(value) {
    const props = this.props;
    return !props.validator? undefined : props.validator(value, props);
  }

  // @return a Promise with the validation result. The result is the error message to display
  validate() {
    const allProps = this.props;
    const validationProps = Validators.filterValidationProps(allProps);
    const value = this.state.value;
    let messageOrPromise = undefined;

    // validator for each property
    Object.keys(validationProps).find((prop) => {
      const validator = Validators[allProps.type + '.' + prop] || Validators[prop];
      if (validator) {
        return (messageOrPromise = validator(value, allProps));
      } 
    });

    // custom validator specified by the user
    messageOrPromise = messageOrPromise || this.customValidation(value);

    // return promise in every case, and change state to reflect the change 
    const promise = isPromise(messageOrPromise)? messageOrPromise : Promise.resolve(messageOrPromise);
    return promise.then((errorMessage) => {
      this.setState({ errorMessage });
      return errorMessage;
    });
    return promise;
  }

  render() {
    const errorMessage = this.state.errorMessage? (<div className="input-error">{ this.state.errorMessage }</div>) : undefined;
    const { state, validator, ...props } = this.props;
    props[this.valueProp] = this.converter.toString(this.state.value);
    props.onChange = this.onChange;
    props.ref = 'element';
    const element = React.createElement(this.getNestedElementClass(), props, props.children);
    return <div className={'input-wrapper ' + (props.type || '')}>{ element }{errorMessage}</div>;
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
