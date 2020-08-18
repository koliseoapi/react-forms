import renderer, { act, ReactTestRenderer } from "react-test-renderer";
import React from "react";
import { Form, Input } from "../src";

describe("Form", function () {
  let form: ReactTestRenderer;

  function triggerChange(value: string) {
    act(() => {
      const inputElement = form.root.findAll((el) => el.type == "input")[0];
      inputElement.props.onChange({
        target: {
          value,
        },
      });
    });
  }

  async function triggerSubmit() {
    return act(async () => {
      const formElement = form.root.find((el) => el.type == "form");
      await formElement.props.onSubmit({ preventDefault() {} });
    });
  }

  it("Performs a shallow copy of the data", async () => {
    const initialValues = { foo: "bar" };
    const onSubmit = jest.fn();
    act(() => {
      form = renderer.create(
        <Form onSubmit={onSubmit} initialValues={initialValues}>
          <Input name="foo" type="text" />
        </Form>
      );
    });
    triggerChange("baz");
    await triggerSubmit();
    expect(initialValues).toEqual({
      foo: "bar",
    });
    expect(onSubmit).toHaveBeenCalledWith({
      foo: "baz",
    });
  });
});
