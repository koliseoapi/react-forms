import React from "react";
import PropTypes from "prop-types";
import isPromise from "is-promise";
import Validators from "./Validators";
import Converters from "./Converters";

// component that will propagate any changes to state[props.name]
export default class BoundComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onChange = this.onChange.bind(this);
    this.state = {};
    this.state.value = this.getStateObject()[props.name];
  }

  getConverter() {
    const props = this.props;
    return props.converter || Converters[props.type] || Converters.text;
  }

  getStateObject() {
    return this.props.state || this.context.form.props.state;
  }

  getStateValue() {
    return this.getStateObject()[this.props.name];
  }

  // get the property from the element after passing it through the Converter
  // the property will be element.value most of the time except for checkboxes and radio buttons
  getElementValue(element) {
    const props = this.props;
    const valueProp = props.type === "checkbox" ? "checked" : "value";
    return this.getConverter().toObject(element[valueProp], props);
  }

  onChange(e) {
    const { name, onChange, type } = this.props;
    const value = this.getElementValue(e.target);
    this.setState({ errorMessage: undefined });
    this.getStateObject()[name] = value;
    onChange && onChange(e);
    if (type === "radio") {
      this.context.radioGroup.onChange();
    }
  }

  componentDidMount() {
    this.context.form.addValidationComponent(this);
  }

  componentWillUnmount() {
    this.context.form.removeValidationComponent(this);
  }

  // launch the custom validation from props.validator
  customValidation(value) {
    const props = this.props;
    return !props.validator ? undefined : props.validator(value, props);
  }

  // @return a Promise with the validation result. The result is the error message to display
  validate() {
    const allProps = this.props;
    const validationProps = Validators.filterValidationProps(allProps);
    const value = this.getStateValue();
    let messageOrPromise = undefined;

    // validator for each property
    Object.keys(validationProps).find(prop => {
      const validator =
        prop === "type"
          ? Validators[allProps.type]
          : Validators[allProps.type + "." + prop] || Validators[prop];
      if (validator) {
        return (messageOrPromise = validator(value, allProps));
      }
    });

    // custom validator specified by the user
    messageOrPromise = messageOrPromise || this.customValidation(value);

    // return promise in every case, and change state to reflect the change
    const promise = isPromise(messageOrPromise)
      ? messageOrPromise
      : Promise.resolve(messageOrPromise);
    return promise.then(errorMessage => {
      this.setState({ errorMessage });
      return errorMessage;
    });
  }

  getNestedElementProps() {
    const value = this.getConverter().toString(this.getStateValue());
    const { state, validator, converter, ...props } = this.props;
    const errorMessageId = this.getErrorMessageId();
    if (props.type === "checkbox") {
      props.checked = value;
    } else if (props.type === "radio") {
      props.checked = props.value == value;
    } else {
      props.value = value;
    }
    if (errorMessageId) {
      props["aria-invalid"] = true;
      props["aria-describedby"] = errorMessageId;
    }
    props.onChange = this.onChange;
    return props;
  }

  getErrorMessageId() {
    return this.state.errorMessage
      ? `${this.props.name || this.props.id}_error`
      : undefined;
  }

  render() {
    const { errorMessage } = this.state;
    const errorMessageElement = errorMessage ? (
      <div className="input-error" id={this.getErrorMessageId()} role="alert">
        {errorMessage}
      </div>
    ) : (
      undefined
    );
    const props = this.getNestedElementProps();
    const element = React.createElement(
      this.getNestedElementClass(),
      props,
      props.children
    );
    return (
      <div className={"input-wrapper " + (props.type || "")}>
        {element}
        {errorMessageElement}
      </div>
    );
  }
}

BoundComponent.propTypes = {
  // name of the input field. Will be used to set the value into the state object
  name: PropTypes.string.isRequired,

  // the state from the parent Form can be overriden at the element level
  state: PropTypes.object
};

BoundComponent.contextTypes = {
  form: PropTypes.object.isRequired,
  radioGroup: PropTypes.object
};
