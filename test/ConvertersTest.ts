import { Converters } from "../src/core/Converters";

describe("Converters", () => {
  it("Text should take care of null and undefined converting to string", () => {
    const text = Converters.text;
    expect(text.toValue(undefined)).toMatch("");
    expect(text.toValue(null)).toMatch("");
    expect(text.toValue("")).toMatch("");
    expect(text.toValue("foo")).toMatch("foo");
  });

  it("Number should convert to integer or float", () => {
    const number = Converters.number;
    expect(number.fromValue({ value: "" })).toBeUndefined();
    expect(number.fromValue({ value: "5.1", step: 1 })).toBe(5);
    expect(number.fromValue({ value: "5.1", step: 0.1 })).toBe(5.1);
  });

  it("[url, date, time] should convert blank strings to undefined and back", () => {
    expect(Converters.url.fromValue({ value: "https://foo.com" })).toMatch(
      "https://foo.com"
    );
    expect(Converters.date.fromValue({ value: "2020-01-02" })).toMatch(
      "2020-01-02"
    );
    expect(Converters.time.fromValue({ value: "10:10" })).toMatch("10:10");

    [Converters.url, Converters.date, Converters.time].forEach((type) => {
      expect(type.fromValue({ value: "" })).toBeUndefined();
      expect(type.fromValue({ value: undefined })).toBeUndefined();
      expect(type.fromValue({ value: null })).toBeUndefined();
      expect(type.toValue(undefined)).toBe("");
      expect(type.toValue(null)).toBe("");
      expect(type.toValue("")).toBe("");
    });
  });
});
