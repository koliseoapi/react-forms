import renderer, { act, ReactTestRenderer } from "react-test-renderer";
import React from "react";
import { Form, Input, FieldSet, Button } from "../src";

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

  it("Adds and removes in-progress while submitting", async () => {
    const initialValues = { foo: "bar" };
    const onSubmit = () => {
      expect(form.toJSON()).toMatchSnapshot();
      throw new Error("foobar");
    };
    act(() => {
      form = renderer.create(
        <Form onSubmit={onSubmit} initialValues={initialValues}>
          <FieldSet>
            <Input name="foo" type="text" />
            <Button>Save</Button>
          </FieldSet>
        </Form>
      );
    });
    try {
      await triggerSubmit();
      fail("Should not suceed");
    } catch (e) {
      expect(e.message).toBe("foobar");
      expect(form.toJSON()).toMatchSnapshot();
    }
  });

  it("Does not try to update when unmounted", async () => {
    function TestComponent() {
      const [submitted, setSubmitted] = React.useState(false);
      return submitted ? null : (
        <Form
          onSubmit={async () => setSubmitted(true)}
          initialValues={{}}
        ></Form>
      );
    }
    act(() => {
      form = renderer.create(<TestComponent />);
    });

    console.error = jest.fn();
    await triggerSubmit();
    expect(console.error).not.toHaveBeenCalled();
  });
});
