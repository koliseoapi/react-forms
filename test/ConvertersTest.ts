import { Converters } from "../src/core/Converters";

describe("Converters", () => {
  it("Text should take care of null and undefined converting to String ", () => {
    const text = Converters.text;
    expect(text.toString(undefined)).toMatch("");
    expect(text.toString(null)).toMatch("");
    expect(text.toString("")).toMatch("");
    expect(text.toString("foo")).toMatch("foo");
  });

  it("[url, date, time] should convert blank strings to undefined and back", () => {
    expect(Converters.url.toObject("https://foo.com")).toMatch(
      "https://foo.com"
    );
    expect(Converters.date.toObject("2020-01-02")).toMatch("2020-01-02");
    expect(Converters.time.toObject("10:10")).toMatch("10:10");

    [Converters.url, Converters.date, Converters.time].forEach((type) => {
      expect(type.toObject("")).toBeUndefined();
      expect(type.toObject(undefined)).toBeUndefined();
      expect(type.toObject(null)).toBeUndefined();
      expect(type.toString(undefined)).toBe("");
      expect(type.toString(null)).toBe("");
      expect(type.toString("")).toBe("");
    });
  });
});
