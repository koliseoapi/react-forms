import { isNullOrUndefined, isBlank } from "./utils";
import { InputHTMLAttributes } from "react";

function emptyToUndef({ value }): string | undefined {
  return isBlank(value) ? undefined : value;
}

function nullOrUndefToEmpty(value: string | null | undefined): string {
  return isNullOrUndefined(value) ? "" : value;
}

export interface Converter<V> {
  /** Convert from the HTML attributes into a JavaScript value */
  fromValue(props: InputHTMLAttributes<HTMLInputElement>): V;

  /** Convert from JavaScript value into the `value` HTML attribute */
  toValue(input: V): string;
}

interface ConvertersType {
  text: Converter<string>;
  url: Converter<string>;
  number: Converter<number>;
  date: Converter<string>;
  time: Converter<string>;
}

export const Converters: ConvertersType = {
  text: {
    fromValue({ value }) {
      return value as string;
    },
    toValue: nullOrUndefToEmpty,
  },

  url: {
    fromValue: emptyToUndef,
    toValue: nullOrUndefToEmpty,
  },

  number: {
    fromValue({ value, step }) {
      const input = value as string;
      return isBlank(input)
        ? undefined
        : step == 1
        ? parseInt(input)
        : parseFloat(input);
    },

    toValue(input) {
      return isNullOrUndefined(input) ? "" : "" + input;
    },
  },

  date: {
    fromValue: emptyToUndef,
    toValue: nullOrUndefToEmpty,
  },

  time: {
    fromValue: emptyToUndef,
    toValue: nullOrUndefToEmpty,
  },
};
