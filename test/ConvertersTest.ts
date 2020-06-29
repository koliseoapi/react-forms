import { Converters } from "../src/core/Converters";

describe("Converters", () => {
  it("Text should take care of null and undefined converting to string", () => {
    const text = Converters.text;
    expect(text.objectToHtml(undefined)).toMatch("");
    expect(text.objectToHtml(null)).toMatch("");
    expect(text.objectToHtml("")).toMatch("");
    expect(text.objectToHtml("foo")).toMatch("foo");
  });

  it("Number should convert to integer or float", () => {
    const number = Converters.number;
    expect(number.htmlToObject({ value: "" })).toBeUndefined();
    expect(number.htmlToObject({ value: "5.1", step: 1 })).toBe(5);
    expect(number.htmlToObject({ value: "5.1", step: 0.1 })).toBe(5.1);
  });

  it("[url, date, time] should convert blank strings to undefined and back", () => {
    expect(Converters.url.htmlToObject({ value: "https://foo.com" })).toMatch(
      "https://foo.com"
    );
    expect(Converters.date.htmlToObject({ value: "2020-01-02" })).toMatch(
      "2020-01-02"
    );
    expect(Converters.time.htmlToObject({ value: "10:10" })).toMatch("10:10");

    [Converters.url, Converters.date, Converters.time].forEach((type) => {
      expect(type.htmlToObject({ value: "" })).toBeUndefined();
      expect(type.htmlToObject({ value: undefined })).toBeUndefined();
      expect(type.htmlToObject({ value: null })).toBeUndefined();
      expect(type.objectToHtml(undefined)).toBe("");
      expect(type.objectToHtml(null)).toBe("");
      expect(type.objectToHtml("")).toBe("");
    });
  });
});
