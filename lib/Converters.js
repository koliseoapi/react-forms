// converter methods for input types
const isNullOrUndefined = function(value) {
  return typeof(value) === "undefined" || value === null;
}
function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}
const isEmptyString = function(value) {
  return value.length == 0;
}

const passTrough = function(value) {
  return value;
}

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