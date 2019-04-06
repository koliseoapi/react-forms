import "jsdom-global/register";
import assert from "assert";
import { describe } from "mocha";
import Converters from "../src/Converters";

const equal = assert.equal;
describe("Converters", function() {
  it("Text should take care of null and undefined converting to String ", function() {
    const text = Converters.text;
    equal(text.toString(undefined), "");
    equal(text.toString(null), "");
    equal(text.toString(false), "");
    equal(text.toString(""), "");
    equal(text.toString("foo"), "foo");
  });

  it("URL should convert blank strings to undefined on toObject", function() {
    const url = Converters.url;
    equal(url.toObject("https://foo.com"), "https://foo.com");
    equal(url.toObject(""), undefined);
    equal(url.toObject(undefined), undefined);
  });
});
