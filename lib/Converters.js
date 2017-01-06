// converter methods for input types
const isNullOrUndefined = function(value) {
  return typeof(value) === "undefined" || value === null;
}

const isEmptyString = function(value) {
  return value.length == 0;
}

const passTrough = function(value) {
  return value;
}

const Converters = {

  text: {

    // transform from String representation to object. Empty Strings are returned as undefined.
    // strings are trimmed by default
    toObject: function(value) {
      if (!isNullOrUndefined(value)) {
        value = value.trim();
      }
      return value? value : undefined;
    },  

    // transform from object to String. Null and undefined values are converted to an empty String
    toString: function(value) {
      return isNullOrUndefined(value)? '' : value;
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

  },

  checkbox: {

    toObject: passTrough,
    toString: passTrough

  }

}

export default Converters;