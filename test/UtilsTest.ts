import { setNestedProperty, getNestedProperty } from "../src/core/utils";

describe("Utils", () => {
  it("setNestedProperty", () => {
    expect(setNestedProperty({}, "foo", "bar")).toMatchObject({
      foo: "bar",
    });
    expect(setNestedProperty({}, "foo.bar", "baz")).toMatchObject({
      foo: { bar: "baz" },
    });
    expect(setNestedProperty({}, "foo[0].bar[1]", "baz")).toMatchObject({
      foo: [{ bar: [, "baz"] }],
    });
    expect(setNestedProperty({}, "foo[0].bar[0].baz", "1")).toMatchObject({
      foo: [{ bar: [{ baz: "1" }] }],
    });
    expect(
      setNestedProperty(
        { foo: [{ bar: [{ lorem: "ipsum" }] }] },
        "foo[0].bar[0].baz",
        "1"
      )
    ).toMatchObject({
      foo: [{ bar: [{ baz: "1", lorem: "ipsum" }] }],
    });
    expect(setNestedProperty({ foo: ["bar"] }, "foo[1]", "1")).toMatchObject({
      foo: ["bar", "1"],
    });
  });

  it("getNestedProperty", () => {
    expect(getNestedProperty({ foo: "bar" }, "foo")).toBe("bar");
    expect(getNestedProperty({ foo: { bar: "baz" } }, "foo.bar")).toBe("baz");
    expect(getNestedProperty({}, "foo")).toBeUndefined();
    expect(getNestedProperty({}, "foo.bar")).toBeUndefined();
    expect(getNestedProperty({ foo: undefined }, "foo.bar")).toBeUndefined();
    expect(
      getNestedProperty({ foo: [{ bar: ["", "baz"] }] }, "foo[0].bar[1]")
    ).toBe("baz");
    expect(getNestedProperty({ foo: [] }, "foo[0].bar[1]")).toBeUndefined();
  });
});
