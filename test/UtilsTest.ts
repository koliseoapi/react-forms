import { setNestedProperty, getNestedProperty } from "../src/core/utils";

describe("Utils", () => {
  it("setNestedProperty", () => {
    expect(setNestedProperty({}, "foo", "bar")).toMatchObject({
      foo: "bar",
    });
    expect(setNestedProperty({}, "foo.bar", "baz")).toMatchObject({
      foo: { bar: "baz" },
    });
  });

  it("getNestedProperty", () => {
    expect(getNestedProperty({ foo: "bar" }, "foo")).toBe("bar");
    expect(getNestedProperty({ foo: { bar: "baz" } }, "foo.bar")).toBe("baz");
    expect(getNestedProperty({}, "foo")).toBeUndefined();
    expect(getNestedProperty({}, "foo.bar")).toBeUndefined();
    expect(getNestedProperty({ foo: undefined }, "foo.bar")).toBeUndefined();
  });
});
