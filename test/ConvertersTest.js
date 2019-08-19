import Converters from "../src/Converters";

describe("Converters", () => {
  it("Text should take care of null and undefined converting to String ", () => {
    const text = Converters.text;
    expect(text.toString(undefined)).toMatch("");
    expect(text.toString(null)).toMatch("");
    expect(text.toString(false)).toBe(false);
    expect(text.toString("")).toMatch("");
    expect(text.toString("foo")).toMatch("foo");
  });

  it("URL should convert blank strings to undefined on toObject", () => {
    const url = Converters.url;
    expect(url.toObject("https://foo.com")).toMatch("https://foo.com");
    expect(url.toObject("")).toBeUndefined();
    expect(url.toObject(undefined)).toBeUndefined();
  });
});
