/**
   TODO multilanguage
    it("should pass props to customize validation messages", function () {
    const validators = new ValidationActions(
      new Messages({
        required: "Please fill out ${name}",
        min: "${name} value must be greater than or equal to ${min}",
        max: "Value must be less than or equal to ${max}",
        url: "Please enter a URL for ${name}",
        email: "Please include a valid e-mail address for ${name}",
        pattern: "Please match the requested format for ${name}",
        maxLength: "Value must have no more than ${maxLength} characters",
      })
    );
    const props = { name: "Foo" };
    expect(ValidationActions.required(undefined, props)).toBe("Please fill out Foo");
    expect(ValidationActions.number_min(-1, { ...props, min: 0 })).toBe(
      "Foo value must be greater than or equal to 0"
    );
    expect(ValidationActions.number_max(6, { ...props, max: 5 })).toBe(
      "Value must be less than or equal to 5"
    );
    expect(ValidationActions.url("foo", props)).toBe("Please enter a URL for Foo");
    expect(ValidationActions.email("foo", props)).toBe(
      "Please include a valid e-mail address for Foo"
    );
    expect(ValidationActions.pattern("foo", { ...props, pattern: "[0-9]+" })).toBe(
      "Please match the requested format for Foo"
    );
    expect(ValidationActions.maxLength("foo", { ...props, maxLength: 2 })).toBe(
      "Value must have no more than 2 characters"
    );
  });

 */

import React from "react";
import renderer, { act, ReactTestRenderer } from "react-test-renderer";
import { Form } from "../src/components/Form";
import { I18nContext } from "../src/components/I18nContext";
import { Input } from "../src/components/InputElements";

describe("Input", function () {
  let onSubmit: () => Promise<string>;

  let form: ReactTestRenderer;

  it("should render a validation error", async function () {
    onSubmit = jest.fn(async () => "foo");
    // act() to wait for the useEffect() calls on initial render
    act(() => {
      form = renderer.create(
        <I18nContext.Provider
          value={{ required: "Por favor, introduzca un valor" }}
        >
          <Form onSubmit={onSubmit} initialValues={{}}>
            <Input type="text" required name="name" />
          </Form>
        </I18nContext.Provider>
      );
    });
    await act(async () => {
      const formElement = form.root.find((el) => el.type == "form");
      try {
        await formElement.props.onSubmit({
          preventDefault() {},
          stopPropagation() {},
        });
      } catch (errors) {
        expect(errors).toMatchObject({
          name: "Por favor, introduzca un valor",
        });
      }
    });
    expect(form.toJSON()).toMatchSnapshot();
  });
});
