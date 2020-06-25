export function isNullOrUndefined(value?: any): boolean {
  return typeof value === "undefined" || value === null;
}
export function isBlank(str: string): boolean {
  return !str || /^\s*$/.test(str);
}

export function isFalse(value: boolean): boolean {
  return value === false;
}
