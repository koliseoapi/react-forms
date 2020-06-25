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
  htmlToObject(props: InputHTMLAttributes<HTMLInputElement>): V;

  /** Convert from JavaScript value into the `value` HTML attribute */
  objectToHtml(input: V): string;
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
    htmlToObject({ value }) {
      return value as string;
    },
    objectToHtml: nullOrUndefToEmpty,
  },

  url: {
    htmlToObject: emptyToUndef,
    objectToHtml: nullOrUndefToEmpty,
  },

  number: {
    htmlToObject({ value, step }) {
      const input = value as string;
      return isBlank(input)
        ? undefined
        : step == 1
        ? parseInt(input)
        : parseFloat(input);
    },

    objectToHtml(input) {
      return isNullOrUndefined(input) ? "" : "" + input;
    },
  },

  date: {
    htmlToObject: emptyToUndef,
    objectToHtml: nullOrUndefToEmpty,
  },

  time: {
    htmlToObject: emptyToUndef,
    objectToHtml: nullOrUndefToEmpty,
  },
};
