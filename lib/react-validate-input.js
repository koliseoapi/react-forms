import isPromise from 'is-promise';
import template from './template';

const isNullOrUndefined = function(value) {
  return typeof(value) === "undefined" || value === null;
}

const isEmptyString = function(value) {
  return value.length == 0;
}

// replace a message key with the translation, interpolating the provided arguments
let messages = {}
const message = function(key, args) {
  return template(messages[key], args);
}

const checkRequired = function(value, required) {
  return !required || value? undefined : message('required');
}

const Types = {
  STRING: "string",
  NUMBER: "number",
  EMAIL: "email",
  DATE: "date",
  DATE_TIME: "datetime",
  CHECKBOX: "checkbox"
};

const Defaults = {
  "string": {

    // transform from String representation to object. Empty Strings are returned as undefined.
    toObject: function(value) {
      return isEmptyString(value)? undefined : value;
    },  

    // transform from object to String. Null and undefined values are converted to an empty String
    toString: function(value) {
      return isNullOrUndefined? '' : value;
    },

    // Receives the value as object and validates it. Return a Promise to wait for its resolution,
    // null or undefined for ok, anything else will be handled as a validation error. 
    validate: function(value, { required }) {
      return checkRequired(value, required);
    }

  },

  "number": {

    attrs: {
      min: 0,
      step: 1
    },

    toObject: function(value) {
      return isEmptyString(value)? undefined : parseInt(value);
    },
    toString: function(value) {
      return isNullOrUndefined(value)? '' : ('' + value);
    },
    validate: function(value, { required, attrs = { min, max } }) {
      return checkRequired(value, required) || (
        tbd()? message('NaN') : 
        !isNullOrUndefined(min) && value < min? message('min', { min }) :
        !isNullOrUndefined(max) && value > max? message('max', { max }) :
        undefined
      );
    }
  },

  "date": {
    toObject: function(value) {
      return isEmptyString(value)? undefined : new Date(value);
    },
    toString: function(value) {
      return isNullOrUndefined? '' : value.toISOString();
    },
    validate: function(value, attrs = { min, max }) {
      return checkRequired(value, required) || (
        tbd()? message('NaD') : 
        !isNullOrUndefined(min) && value < min? message('min') :
        !isNullOrUndefined(max) && value > max? message('max') :
        undefined
      );
    }
  }
}

class Validator {

  constructor(props, state = {}) {
    this.state = state;
    const config = {};
    Object.keys(props).map((key) => { 
      let propertyConfig = props[key];
      const type = propertyConfig.type || Types.STRING;
      const defaults = DEFAULTS[type];

      config[key] = Object.assign({

        // HTML5 attributes
        attrs: Object.assign({
          // unique ID 
          id: '__rvi__' + key,

          // HTML5 input type
          type: type,

          // required field
          required: false,

          // when the value changes, update the state object
          onChange: function(e) {
            const s = e.target.type === 'checkbox'? e.target.checked : e.target.value;
            state[key] = propertyConfig.toObject(s);
            console.log(state[key])
          },
        }, (defaults || {}).attrs, propertyConfig.attrs),  

      }, defaults, propertyConfig);
    });
    this.config = config;
  }

  // returns a Promise with all error messages with the form
  // { key, error }
  validate() {
    const config = this.config;
    const results = Object.keys(config).map((key) => {
      const propertyConfig = config[key];
      try {
        const value = propertyConfig.validate(state[key]);
        return isPromise(value)
          ? value.then((error) => ({ key, error }), error => ({ key, error }))
          : Promise.resolve({ key, value })
      } catch (error) {
        return Promise.resolve({ key, error })
      }

    });

    // wait for all validations and filter out empty values
    return Promise.all(results).then(function(results) {
      return results.filter(function(value) {
        return !isNullOrUndefined(value);
      })
    });
  }

}

Validator.setMessages = function(m) {
  messages = m;
}

export { Validator, Types, Defaults };
