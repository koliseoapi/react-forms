import React from 'react';

const isNullOrUndefined = function(value) {
  return typeof(value) === "undefined" || value === null;
}

const isEmptyString = function(value) {
  return value.length == 0;
}

// converter methods for input types
const Converters = {
  text: {

    // transform from String representation to object. Empty Strings are returned as undefined.
    toObject: function(value) {
      return isEmptyString(value)? undefined : value;
    },  

    // transform from object to String. Null and undefined values are converted to an empty String
    toString: function(value) {
      return /*isNullOrUndefined? '' :*/ value;
    }

  },

  number: {

    toObject: function(value, attrs) {
      return isEmptyString(value)? undefined : 
        attrs.step == 1? parseInt(value) :
        parseFloat(value);
    },

    toString: function(value) {
      return isNullOrUndefined(value)? '' : ('' + value);
    }

  }
}


class Form extends React.Component {

  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    const form = e.target;
    if (form.validate) {
      form.validate() && this.onSubmit();
    } else {
      this.props.onSubmit();
    }
  }

  render() {
    return (
      <form {...this.props} onSubmit={this.onSubmit}>
        {this.props.children}
      </form>
    )  
  }
}

Form.propTypes = {
  // the callback that will be invoked on submit, if validation passes
  onSubmit: React.PropTypes.func.isRequired
}


// component that will propagate any changes to state[props.name]
class BoundComponent extends React.Component {

  constructor(props) {
    super(props);
    this.converter = Converters[props.type] || Converters.text;
    this.state = {
      value: props.state[props.name]
    }
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const props = this.props;
    const value = this.converter.toObject(e.target.value, props);
    this.setState({ value });
    this.props.state[props.name] = value;
/*
    console.log('value=' + value);
    console.log('this.state.value=' + this.state.value);
    console.log('this.props.state[props.name]=' + this.props.state[props.name]);
    */
  }

  render() {
    const value = this.converter.toString(this.state.value);
    const { state, ...props } = this.props;
    props.value = value;
    props.onChange = this.onChange;
    return React.createElement(this.getNestedElementClass(), props, props.children);
  }

}

const propTypes = React.PropTypes;
BoundComponent.propTypes = {
  name: propTypes.string.isRequired,
  state: propTypes.object.isRequired
}

function createBoundComponent(NestedElementClass) {
  return class GeneratedClass extends BoundComponent {
    getNestedElementClass() {
      return NestedElementClass;
    }
  }
}

const Input = createBoundComponent("input");
Input.propTypes = {
  type: propTypes.string.isRequired
}

const TextArea = createBoundComponent("textarea");
const Select = createBoundComponent("select");

export { Form, Input, TextArea, Select };
