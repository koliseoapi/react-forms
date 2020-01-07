import React from "react";
import { Form, TextArea } from "../src/react-forms";
import renderer from "react-test-renderer";

function noop() {}
describe("TextArea", function() {
  let form;

  function mountTextArea(textarea, state) {
    return renderer.create(
      <Form onSubmit={noop} state={state}>
        {textarea}
      </Form>
    );
  }

  it("should not propagate specific properties to the HTML5 element", function() {
    const testConverter = {
      toObject(value) {
        return value;
      },
      toString(value) {
        return value;
      }
    };
    const form = mountTextArea(
      <TextArea
        className="foo"
        state={{ foo: "foo" }}
        name="name"
        converter={testConverter}
      />,
      {}
    );
    // converter attribute should not be propagated to nested <textarea>
    const textArea = form.getInstance().props.children;
    expect(textArea.type).toBe(TextArea);
    expect(textArea.props.converter).toBe(testConverter);
  });
});
