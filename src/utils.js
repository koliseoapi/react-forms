function isNullOrUndefined(value) {
  return typeof value === "undefined" || value === null;
}
function isBlank(str) {
  return !str || /^\s*$/.test(str);
}

function isFalse(value) {
  return value === false;
}

export { isNullOrUndefined, isBlank, isFalse };
