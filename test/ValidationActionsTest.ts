import { ValidationActions } from "../src/core/ValidationActions";
import { Messages, defaultEntries } from "../src/core/Messages";

describe("ValidationActions", function () {
  it("Required should reject empty, null, false and undefined", function () {
    function failRequired(value: any) {
      expect(ValidationActions.required(value, { required: true })).toMatch(
        "required"
      );
    }

    expect(
      ValidationActions.required("foo", { required: true })
    ).toBeUndefined();
    failRequired(null);
    failRequired(undefined);
    failRequired(false);
    failRequired("");
    failRequired(" \t");
  });

  it("number.required should reject null and undefined, but acept 0", function () {
    function failRequired(value: any) {
      expect(ValidationActions.number_required(value, props)).toMatch(
        "required"
      );
    }

    const props = { required: true };
    expect(
      ValidationActions.number_required(0, { required: true })
    ).toBeUndefined();
    failRequired(null);
    failRequired(undefined);
  });

  it("Number min value", function () {
    const min = ValidationActions.number_min;
    const props = { min: 0 };
    expect(min(-1, props)).toMatch("min");
    expect(min(0, { min: 0 })).toBeUndefined();
    expect(min(1, { min: 0 })).toBeUndefined();
  });

  it("Number max value", function () {
    const max = ValidationActions.number_max;
    const props = { max: 100 };
    expect(max(99, props)).toBeUndefined();
    expect(max(100, props)).toBeUndefined();
    expect(max(101, props)).toMatch("max");
  });

  it("Date min value", function () {
    const min = ValidationActions.date_min;
    const props = { min: "2020-10-01" };
    expect(min("1999-01-01", props)).toMatch("min");
    expect(min("2021-01-01", props)).toBeUndefined();
    expect(min("2021-01-01", {})).toBeUndefined();
  });

  it("Date max value", function () {
    const max = ValidationActions.date_max;
    const props = { max: "2020-10-01" };
    expect(max("2021-01-01", props)).toMatch("max");
    expect(max("1999-01-01", props)).toBeUndefined();
    expect(max("1999-01-01", {})).toBeUndefined();
  });

  it("Max length", function () {
    const maxLength = ValidationActions.maxLength;
    const props = { maxLength: 4 };
    expect(maxLength("abc", props)).toBeUndefined();
    expect(maxLength("abcd", props)).toBeUndefined();
    expect(maxLength("abcde", props)).toMatch("maxLength");
    expect(maxLength("", {})).toBeUndefined();
  });

  it("URL format", function () {
    expect(ValidationActions.url("http://foo.bar", undefined)).toBeUndefined();
    expect(ValidationActions.url("foo", undefined)).toMatch("url");
  });

  it("E-mail format", function () {
    expect(ValidationActions.email("a@b", undefined)).toBeUndefined();
    expect(ValidationActions.email("foo", undefined)).toMatch("email");
  });

  it("Pattern format", function () {
    const pattern = ValidationActions.pattern;
    const props = { pattern: "[0-9]+" };
    const patternErrorMessage = "pattern";
    expect(pattern("1234", props)).toBeUndefined();
    expect(pattern("ab1234", props)).toMatch(patternErrorMessage);
    expect(pattern("1234cd", props)).toMatch(patternErrorMessage);
  });
});
