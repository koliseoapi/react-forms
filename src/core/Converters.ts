import { isNullOrUndefined, isBlank } from "./utils";
import { InputHTMLAttributes } from "react";

function emptyToUndef({
  value,
}: {
  value: string | undefined;
}): string | undefined {
  return isBlank(value) ? undefined : value;
}

function nullOrUndefToEmpty(value: string | null | undefined): string {
  return isNullOrUndefined(value) ? "" : value!;
}

export interface Converter<V> {
  /** Convert from the HTML attributes into a JavaScript value */
  fromValue(props: InputHTMLAttributes<HTMLInputElement>): V | undefined;

  /** Convert from JavaScript value into the `value` HTML attribute */
  toValue(input: V | undefined | null): string;
}

interface ConvertersType {
  [key: string]: Converter<any>;
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

  checkbox: {
    fromValue({ value, checked }) {
      return value ? (checked ? value : undefined) : checked;
    },
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
