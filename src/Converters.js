import { isNullOrUndefined, isBlank, passThrough } from './utils';


const Converters = {

  text: {

    // transform from String representation to object. 
    toObject: function(value) {
      return value;
    },  

    // transform from object to String. Null and undefined values are converted to an empty String
    toString: function(value) {
      return isNullOrUndefined(value)? '' : value;
    }

  },

  number: {

    toObject: function(value, attrs) {
      return isBlank(value)? undefined : 
        attrs.step == 1? parseInt(value) :
        parseFloat(value);
    },

    toString: function(value) {
      return isNullOrUndefined(value)? '' : ('' + value);
    }

  },

  radio: {

    toObject: function(value, attrs) {
      return !value? undefined : attrs.value;
    },

    toString: function(value, attrs) {
      return value === attrs.value;
    }

  },

  checkbox: {

    toObject: passThrough,
    toString: passThrough

  }

}

export default Converters;