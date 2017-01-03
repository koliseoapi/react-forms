import Messages from './Messages';
import { isNullOrUndefined } from './utils';

export default {

  required: function(value) {
    if (isNullOrUndefined(value)) {
      return Messages.get('required');
    }
  },

  "number.min": function(value, props) {
    if (!isNullOrUndefined(value) && value < +props.min) {
      return Messages.get('min', props);
    }
  },

  "number.max": function(value, props) {
    if (!isNullOrUndefined(value) && value > +props.max) {
      return Messages.get('max', props);
    }
  },

  // return the list of properties susceptible of validation
  filterValidationProps: function(props) {
    const result = {};
    [ 'type', 'required', 'min', 'max', 'pattern' ].forEach(function(key) {
      const value = props[key];
      if (!isNullOrUndefined(value)) {
        result[key] = value;
      }
    }) 
    return result;
  }

}