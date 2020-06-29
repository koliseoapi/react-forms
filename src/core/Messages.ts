export function template(message: string, data: any) {
  var templateReplace = function (s: string, match: string) {
    return data[match.trim()];
  };

  return message.replace(/\$\{([^}]+)}/g, function (s, match) {
    return templateReplace(s, match);
  });
}

export type EntriesType = {
  [key: string]: string;
};

export const defaultEntries: EntriesType = {
  required: "Please fill out this field",
  min: "Value must be greater than or equal to ${min}",
  max: "Value must be less than or equal to ${max}",
  url: "Please enter a URL",
  email: "Please include a valid email address",
  pattern: "Please match the requested format",
  maxLength: "Value must have no more than ${maxLength} characters",
};

export class Messages {
  readonly entries: EntriesType;

  constructor(entries: EntriesType) {
    this.entries = entries;
  }

  /**
   * Returns this i18n key, interpolating the values from props
   */
  get(key: string, props: any): string {
    return template(this.entries[key], props);
  }
}
