import React from "react";
import { Form, Input, RadioGroup } from "../src/react-forms";
import renderer from "react-test-renderer";

function noop() {}
describe("Input", function() {
  function mount(input, state) {
    return renderer.create(
      <Form onSubmit={noop} state={state}>
        {input}
      </Form>
    );
  }

  function getInputElement(form) {
    const inputElement = form.root.find(el => el.type == "input");
    expect(inputElement.type).toBe("input");
    return inputElement;
  }

  it("should render correctly", function() {
    const state = { name: "foobar" };
    const form = mount(
      <Input type="text" className="foo" required name="name" />,
      state
    );
    // input has class 'foo'
    // input is required
    expect(form.toJSON()).toMatchSnapshot();
  });

  it("should render a validation error", function() {
    const state = {};
    const form = mount(<Input type="text" required name="name" />, state);
    return form
      .getInstance()
      .validationComponents[0].validate()
      .then(() => {
        // error message was rendered
        // error message is accessible: role=alert, aria-invalid, aria-describedby
        expect(form.toJSON()).toMatchSnapshot();
      });
  });

  it("should update int on change", function() {
    const state = { age: 20, color: "red" };
    const callback = jest.fn(noop);
    const form = mount(
      <Input
        type="number"
        name="age"
        state={state}
        step="1"
        onChange={callback}
      />,
      state
    );
    const input = getInputElement(form);
    input.props.onChange({
      target: { value: "32.2" }
    });

    expect(state).toMatchObject({
      age: 32,
      color: "red"
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should update float on change", function() {
    const state = { age: 20 };
    const form = mount(<Input type="number" name="age" step="0.01" />, state);
    const input = getInputElement(form);
    input.props.onChange({
      target: { value: "32.2" }
    });
    expect(state.age).toBe(32.2);
  });

  it("should use checked with type=checkbox", function() {
    const state = { subscribed: true };
    const form = mount(<Input type="checkbox" name="subscribed" />, state);
    // input[checked] is set
    // input[value] is not set
    expect(form.toJSON()).toMatchSnapshot();
  });

  it("should not throw required error with not required, unchecked checkboxes", function() {
    const state = { subscribed: false };
    const form = mount(
      <Input type="checkbox" name="subscribed" required={false} />,
      state
    );
    return form
      .getInstance()
      .validationComponents[0].validate()
      .then(() => {
        // no error component
        expect(form.toJSON()).toMatchSnapshot();
      });
  });

  it("should throw required error with required, unchecked checkboxes", function() {
    const state = { subscribed: false };
    const form = mount(
      <Input type="checkbox" name="subscribed" required={true} />,
      state
    );
    return form
      .getInstance()
      .validationComponents[0].validate()
      .then(() => {
        // shows error component
        expect(form.toJSON()).toMatchSnapshot();
      });
  });

  it("should not propagate specific properties to the HTML5 element", function() {
    const form = mount(
      <Input type="text" className="foo" state={{ foo: "foo" }} name="name" />,
      {}
    );
    // state attribute should not be propagated to nested <input>
    expect(getInputElement(form).props.state).toBeUndefined();
  });

  function initAsyncValidator(state) {
    const validator = value =>
      new Promise(resolve => {
        resolve(value === "abc" ? undefined : "Validation failed");
      });
    const form = mount(
      <Input type="text" name="foo" validator={validator} />,
      state
    );
    return form.getInstance();
  }

  it("custom validator with Promise expected to fail", function() {
    const state = { foo: "xyz" };
    const form = initAsyncValidator(state);
    return form.validate().then(result => {
      expect(result).toBe(false);
    });
  });

  it("custom validator with Promise expected to pass", function() {
    const state = { foo: "abc" };
    const form = initAsyncValidator(state);
    return form.validate().then(result => {
      expect(result).toBe(true);
    });
  });

  it("should render type=radio", function() {
    const state = { gender: "male" };
    const form = mount(
      <Form onSubmit={noop} state={state}>
        <RadioGroup>
          <div>
            <Input type="radio" name="gender" value="male" />,
            <Input type="radio" name="gender" value="female" />
          </div>
        </RadioGroup>
      </Form>,
      state
    );
    // male selected, female unselected
    expect(form.toJSON()).toMatchSnapshot(
      "radio: male selected, female unselected"
    );

    // trigger change in input2
    const input2 = form.root.findAll(el => el.type == "input")[1];
    input2.props.onChange({
      target: { value: "female", checked: true }
    });
    expect(form.toJSON()).toMatchSnapshot(
      "radio: female selected, male unselected"
    );
  });

  it("should not throw required error with empty, optional emails", function() {
    const form = mount(<Input type="email" name="email" />, {
      email: ""
    });
    return form
      .getInstance()
      .validationComponents[0].validate()
      .then(() => {
        // no input error
        expect(form.toJSON()).toMatchSnapshot();
      });
  });

  it("should throw required error with required emails", function() {
    const form = mount(<Input type="email" name="email" required />, {
      email: ""
    });
    return form
      .getInstance()
      .validationComponents[0].validate()
      .then(() => {
        // should show input error
        expect(form.toJSON()).toMatchSnapshot();
      });
  });

  it("should add aria-describedby if there are validation errors", function() {
    const form = mount(
      <Input type="text" name="name" required aria-describedby="foobar" />,
      {
        name: ""
      }
    );
    return form
      .getInstance()
      .validationComponents[0].validate()
      .then(() => {
        // should prepend the error message to the existing aria-describedby field
        expect(form.toJSON()).toMatchSnapshot();
      });
  });

  it("should render validation errors when the form value is not an e-mail", function() {
    const form = mount(<Input type="email" name="email" />, {
      email: "foo"
    });
    return form
      .getInstance()
      .validationComponents[0].validate()
      .then(() => {
        // should show input error
        expect(form.toJSON()).toMatchSnapshot();
      });
  });
});
