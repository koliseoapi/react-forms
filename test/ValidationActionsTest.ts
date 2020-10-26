import { Converters } from "../src/core/Converters";
import { isNullOrUndefined } from "../src/core/utils";
import {
  ValidationActions,
  filterActionsForProps,
} from "../src/core/ValidationActions";

describe("ValidationActions", function () {
  it("[required] should reject empty, null, false and undefined", async function () {
    async function failRequired(value: any) {
      expect(
        await ValidationActions.required(value, { name: "foo", required: true })
      ).toMatch("required");
    }

    expect(
      await ValidationActions.required("foo", { name: "foo", required: true })
    ).toBeUndefined();
    await failRequired(null);
    await failRequired(undefined);
    await failRequired(false);
    await failRequired("");
    await failRequired(" \t");
  });

  it("filterActionsForProps()", async function () {
    expect(filterActionsForProps({})).toHaveLength(0);
    expect(filterActionsForProps({ required: true })).toEqual([
      ValidationActions.required,
    ]);
    expect(filterActionsForProps({ required: false })).toEqual([
      ValidationActions.required,
    ]);
    expect(filterActionsForProps({ type: "url", required: true })).toEqual([
      ValidationActions.url,
      ValidationActions.required,
    ]);
    expect(filterActionsForProps({ type: "number", required: true })).toEqual([
      ValidationActions.number_required,
    ]);
    expect(filterActionsForProps({ type: "number", min: 5 })).toEqual([
      ValidationActions.number_min,
    ]);
  });

  it("[type=number][required] should reject null and undefined, but accept 0", async function () {
    async function failRequired(value: any) {
      expect(await ValidationActions.number_required(value, props)).toMatch(
        "required"
      );
    }

    const props = { name: "foo", required: true };
    expect(
      await ValidationActions.number_required(0, {
        name: "foo",
        required: true,
      })
    ).toBeUndefined();
    await failRequired(null);
    await failRequired(undefined);
  });

  it("[type=number][min]", async function () {
    const min = ValidationActions.number_min;
    const props = { name: "foo", min: 0, converter: Converters.number };
    expect(await min(-1, props)).toMatch("min");
    expect(await min(0, props)).toBeUndefined();
    expect(await min(1, props)).toBeUndefined();
  });

  it("[type=number][max]", async function () {
    const max = ValidationActions.number_max;
    const props = { name: "foo", max: 100, converter: Converters.number };
    expect(await max(99, props)).toBeUndefined();
    expect(await max(100, props)).toBeUndefined();
    expect(await max(101, props)).toMatch("max");
  });

  it("[type=number][min][converter]", async function () {
    const min = ValidationActions.number_min;
    const props = { name: "foo", min: "5", converter:  {
      fromValue({ value }) {
        const input = value as string;
        return parseInt(input) * 100;
      },
  
      toValue(input) {
        return isNullOrUndefined(input) ? "" : "" + (input / 100);
      },
    } };
    expect(await min(100, props)).toMatch("min");
    expect(await min(500, props)).toBeUndefined();
  });

  it("[type=date][min]", async function () {
    const min = ValidationActions.date_min;
    const props = { name: "foo", min: "2020-10-01" };
    expect(await min("1999-01-01", props)).toMatch("min");
    expect(await min("2021-01-01", props)).toBeUndefined();
    expect(await min("2021-01-01", { name: "foo" })).toBeUndefined();
  });

  it("[type=date][max]", async function () {
    const max = ValidationActions.date_max;
    const props = { name: "foo", max: "2020-10-01" };
    expect(await max("2021-01-01", props)).toMatch("max");
    expect(await max("1999-01-01", props)).toBeUndefined();
    expect(await max("1999-01-01", { name: "foo" })).toBeUndefined();
  });

  it("[maxLength]", async function () {
    const maxLength = ValidationActions.maxLength;
    const props = { name: "foo", maxLength: 4 };
    expect(await maxLength("abc", props)).toBeUndefined();
    expect(await maxLength("abcd", props)).toBeUndefined();
    expect(await maxLength("abcde", props)).toMatch("maxLength");
    expect(await maxLength("", { name: "foo" })).toBeUndefined();
  });

  it("[type=url]]", async function () {
    expect(
      await ValidationActions.url("http://foo.bar", { name: "foo" })
    ).toBeUndefined();
    expect(await ValidationActions.url("foo", { name: "foo" })).toMatch("url");
  });

  it("[type=email]]", async function () {
    expect(
      await ValidationActions.email("a@b", { name: "foo" })
    ).toBeUndefined();
    expect(await ValidationActions.email("foo", { name: "foo" })).toMatch(
      "email"
    );
  });

  it("[pattern]", async function () {
    const pattern = ValidationActions.pattern;
    const props = { name: "foo", pattern: "[0-9]+" };
    const patternErrorMessage = "pattern";
    expect(await pattern("1234", props)).toBeUndefined();
    expect(await pattern("ab1234", props)).toMatch(patternErrorMessage);
    expect(await pattern("1234cd", props)).toMatch(patternErrorMessage);
  });
});
