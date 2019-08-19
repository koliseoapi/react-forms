import Validators from "../src/Validators";

describe("Validators", function() {
  const requiredErrorMessage = "Please fill out this field";

  it("Required should reject empty, null, false and undefined", function() {
    const required = Validators.required;
    const props = { required: true };
    expect(required("foo", props)).toBeUndefined();
    expect(required(null, props)).toMatch(requiredErrorMessage);
    expect(required(undefined, props)).toMatch(requiredErrorMessage);
    expect(required(false, props)).toMatch(requiredErrorMessage);
    expect(required("", props)).toMatch(requiredErrorMessage);

    // to be confirmed: let's reject blank strings as well
    expect(required(" \t", props)).toMatch(requiredErrorMessage);
  });

  it("number.required should reject null and undefined, but acept 0", function() {
    const required = Validators["number.required"];
    const props = { required: true };
    expect(required(0, props)).toBeUndefined();
    expect(required(null, props)).toMatch(requiredErrorMessage);
    expect(required(undefined, props)).toMatch(requiredErrorMessage);
  });

  it("Min value", function() {
    const min = Validators["number.min"];
    const props = { min: 0 };
    expect(min(-1, props)).toMatch("Value must be greater than or equal to 0");
    expect(min(0, props)).toBeUndefined();
    expect(min(1, props)).toBeUndefined();
    expect(min(0, {})).toBeUndefined();
  });

  it("Max value", function() {
    const max = Validators["number.max"];
    const props = { max: 100 };
    expect(max(99, props)).toBeUndefined();
    expect(max(100, props)).toBeUndefined();
    expect(max(101, props)).toMatch("Value must be less than or equal to 100");
    expect(max(0, {})).toBeUndefined();
  });

  it("Max length", function() {
    const maxLength = Validators["maxLength"];
    const props = { maxLength: 4 };
    expect(maxLength("abc", props)).toBeUndefined();
    expect(maxLength("abcd", props)).toBeUndefined();
    expect(maxLength("abcde", props)).toMatch(
      "Value must have no more than 4 characters"
    );
    expect(maxLength("", {})).toBeUndefined();
  });

  it("URL format", function() {
    const url = Validators.url;
    expect(url("http://foo.bar")).toBeUndefined();
    expect(url("foo")).toMatch("Please enter a URL");
  });

  it("E-mail format", function() {
    const email = Validators.email;
    expect(email("a@b")).toBeUndefined();
    expect(email("foo")).toMatch("Please include a valid e-mail address");
  });

  it("Pattern format", function() {
    const pattern = Validators.pattern;
    const props = { pattern: "[0-9]+" };
    const patternErrorMessage = "Please match the requested format";
    expect(pattern("1234", props)).toBeUndefined();
    expect(pattern("ab1234", props)).toMatch(patternErrorMessage);
    expect(pattern("1234cd", props)).toMatch(patternErrorMessage);
  });

  it("#filterValidationProps should filter only properties that are not empty or false", function() {
    const filtered = Validators.filterValidationProps({
      min: "1",
      foo: "bar",
      required: false
    });
    expect(Object.keys(filtered)).toHaveLength(2);
  });
});
