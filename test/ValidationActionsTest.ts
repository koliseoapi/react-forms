import { ValidationActions } from "../src/core/ValidationActions";

describe("ValidationActions", function () {
  it("Required should reject empty, null, false and undefined", async function () {
    async function failRequired(value: any) {
      expect(
        await ValidationActions.required(value, { required: true })
      ).toMatch("required");
    }

    expect(
      await ValidationActions.required("foo", { required: true })
    ).toBeUndefined();
    await failRequired(null);
    await failRequired(undefined);
    await failRequired(false);
    await failRequired("");
    await failRequired(" \t");
    async function passRequired(value: any) {
      expect(await ValidationActions.required(value, {})).toBeUndefined();
    }
    await passRequired(null);
    await passRequired(undefined);
    await passRequired(false);
    await passRequired("foo");
  });

  it("number.required should reject null and undefined, but acept 0", async function () {
    async function failRequired(value: any) {
      expect(await ValidationActions.number_required(value, props)).toMatch(
        "required"
      );
    }

    const props = { required: true };
    expect(
      await ValidationActions.number_required(0, { required: true })
    ).toBeUndefined();
    await failRequired(null);
    await failRequired(undefined);
    async function passRequired(value: any) {
      expect(
        await ValidationActions.number_required(value, {})
      ).toBeUndefined();
    }
    await passRequired(null);
    await passRequired(undefined);
    await passRequired(false);
    await passRequired(0);
  });

  it("Number min value", async function () {
    const min = ValidationActions.number_min;
    const props = { min: 0 };
    expect(await min(-1, props)).toMatch("min");
    expect(await min(0, { min: 0 })).toBeUndefined();
    expect(await min(1, { min: 0 })).toBeUndefined();
  });

  it("Number max value", async function () {
    const max = ValidationActions.number_max;
    const props = { max: 100 };
    expect(await max(99, props)).toBeUndefined();
    expect(await max(100, props)).toBeUndefined();
    expect(await max(101, props)).toMatch("max");
  });

  it("Date min value", async function () {
    const min = ValidationActions.date_min;
    const props = { min: "2020-10-01" };
    expect(await min("1999-01-01", props)).toMatch("min");
    expect(await min("2021-01-01", props)).toBeUndefined();
    expect(await min("2021-01-01", {})).toBeUndefined();
  });

  it("Date max value", async function () {
    const max = ValidationActions.date_max;
    const props = { max: "2020-10-01" };
    expect(await max("2021-01-01", props)).toMatch("max");
    expect(await max("1999-01-01", props)).toBeUndefined();
    expect(await max("1999-01-01", {})).toBeUndefined();
  });

  it("Max length", async function () {
    const maxLength = ValidationActions.maxLength;
    const props = { maxLength: 4 };
    expect(await maxLength("abc", props)).toBeUndefined();
    expect(await maxLength("abcd", props)).toBeUndefined();
    expect(await maxLength("abcde", props)).toMatch("maxLength");
    expect(await maxLength("", {})).toBeUndefined();
  });

  it("URL format", async function () {
    expect(
      await ValidationActions.url("http://foo.bar", undefined)
    ).toBeUndefined();
    expect(await ValidationActions.url("foo", undefined)).toMatch("url");
  });

  it("E-mail format", async function () {
    expect(await ValidationActions.email("a@b", undefined)).toBeUndefined();
    expect(await ValidationActions.email("foo", undefined)).toMatch("email");
  });

  it("Pattern format", async function () {
    const pattern = ValidationActions.pattern;
    const props = { pattern: "[0-9]+" };
    const patternErrorMessage = "pattern";
    expect(await pattern("1234", props)).toBeUndefined();
    expect(await pattern("ab1234", props)).toMatch(patternErrorMessage);
    expect(await pattern("1234cd", props)).toMatch(patternErrorMessage);
  });
});
