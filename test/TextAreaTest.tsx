import React from "react";
import { Form } from "../src/components/Form";
import { create } from "react-test-renderer";
import { TextArea } from "../src/components/InputElements";

function noop(): Promise<string> {
  return Promise.resolve("foobar");
}
describe("TextArea", function () {
  it("should render", function () {
    const tree = create(
      <Form
        onSubmit={noop}
        initialValues={{
          text: "foobaz",
        }}
      >
        <TextArea className="foo" name="text" />
      </Form>
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
