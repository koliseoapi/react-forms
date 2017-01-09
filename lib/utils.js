function isNullOrUndefined(value) {
  return typeof(value) === "undefined" || value === null;
}
function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}
const passThrough = function(value) {
  return value;
}

export { isNullOrUndefined, isBlank, passThrough }