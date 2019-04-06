import { isNullOrUndefined, isBlank, passThrough } from "./utils";

const Converters = {
  text: {
    // transform from String representation to object.
    toObject: passThrough,

    // transform from object to String. Null and undefined values are converted to an empty String
    toString: function(value) {
      return isNullOrUndefined(value) ? "" : value;
    }
  },

  url: {
    // transform from String representation to object.
    toObject: function(value) {
      return isBlank(value) ? undefined : value;
    },

    toString: function(value) {
      return Converters.text.toString(value);
    }
  },

  number: {
    toObject: function(value, attrs) {
      return isBlank(value)
        ? undefined
        : attrs.step == 1
        ? parseInt(value)
        : parseFloat(value);
    },

    toString: function(value) {
      return isNullOrUndefined(value) ? "" : "" + value;
    }
  },

  checkbox: {
    toObject: passThrough,
    toString: passThrough
  }
};

export default Converters;
