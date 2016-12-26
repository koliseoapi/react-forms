import React from 'react';
import omit from 'lodash/omit';

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


const Form = function(props) {
  return (
    <form { ...props }>
      { props.children }
    </form>
  );
}

// component that will propagate any changes to state[props.name]
class BoundComponent extends React.Component {

  constructor(props) {
    super(props);
    this.converter = Converters[props.type] || Converters.text;
    this.state = props.state;
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const props = this.props;
    this.state[props.name] = this.converter.toObject(e.target.value, props);
  }

  render() {
    const value = this.converter.toString(this.state[this.props.name]);
    const props = omit(this.props, 'state');
    props.value = value;
    props.onChange = this.onChange;
    return React.createElement(this.getNestedElementClass(), props/*, is this needed? props.children*/);
  }

}

const propTypes = React.PropTypes;
BoundComponent.propTypes = {
  name: propTypes.string.isRequired,
  type: propTypes.string.isRequired,
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
const TextArea = createBoundComponent("textarea");
const Select = createBoundComponent("select");

export { Form, Input, TextArea, Select };
