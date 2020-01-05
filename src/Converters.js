import { isNullOrUndefined, isBlank } from "./utils";

const passThrough = function(value) {
  return value;
};

function passEmptyAsUndef(value) {
  return isBlank(value) ? undefined : value;
}

function passNullOrUndefAsEmpty(value) {
  return isNullOrUndefined(value) ? "" : value;
}

const Converters = {
  text: {
    // transform from String representation to object.
    toObject: passThrough,
    toString: passNullOrUndefAsEmpty
  },

  url: {
    // transform from String representation to object.
    toObject: passEmptyAsUndef,
    toString: passNullOrUndefAsEmpty
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
  },

  date: {
    toObject: passEmptyAsUndef,
    toString: passNullOrUndefAsEmpty
  },

  time: {
    toObject: passEmptyAsUndef,
    toString: passNullOrUndefAsEmpty
  }
};

export default Converters;
