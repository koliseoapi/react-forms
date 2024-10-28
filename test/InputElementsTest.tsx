import React, { ReactElement } from "react";
import renderer, { ReactTestRenderer, act } from "react-test-renderer";
import { Form, ValidationErrors } from "../src/components/Form";
import { Input } from "../src/components/InputElements";
import { Converters } from "../src/core/Converters";
import { ValidationResult } from "../src/core/ValidationActions";

describe("Input", function () {
  let onSubmit: () => Promise<string>;

  let form: ReactTestRenderer;

  function mount(input: ReactElement, initialValues: any) {
    onSubmit = jest.fn(async () => "foo");
    // act() to wait for the useEffect() calls on initial render
    act(() => {
      form = renderer.create(
        <Form onSubmit={onSubmit} initialValues={initialValues}>
          {input}
        </Form>
      );
    });
  }

  function triggerChange({
    value,
    checked,
  }: {
    value: string;
    checked?: boolean;
  }) {
    act(() => {
      const inputElement = form.root.findAll((el) => el.type == "input")[0];
      expect(inputElement.type).toBe("input");
      inputElement.props.onChange({
        target: {
          value,
          checked,
        },
      });
    });
  }

  async function triggerSubmit(expectedErrors?: ValidationErrors) {
    return act(async () => {
      const formElement = form.root.find((el) => el.type == "form");
      const errors = await formElement.props.onSubmit({
        preventDefault() {},
        stopPropagation() {},
      });
      if (!errors) {
        expect(expectedErrors).toBeUndefined();
      } else {
        expect(expectedErrors).toBeDefined();
        expect(errors).toMatchObject(expectedErrors!);
      }
    });
  }

  it("should render correctly with type=text", () => {
    mount(<Input type="text" className="foo" required name="name" />, {
      name: "foobar",
    });
    // input has class 'foo'
    // input is required
    expect(form.toJSON()).toMatchSnapshot();
  });

  it("should use checked instead of value with type=checkbox", () => {
    mount(<Input type="checkbox" name="subscribed" />, { subscribed: true });
    // input[checked] is set
    // input[value] is not set
    expect(form.toJSON()).toMatchSnapshot();
  });

  it("should render type=radio", () => {
    mount(
      <>
        <Input type="radio" name="abtesting" defaultValue="a" />
        <Input type="radio" name="abtesting" defaultValue="b" />
      </>,
      { abtesting: "a" }
    );
    // input[checked] is set
    // different id calculated for each input
    expect(form.toJSON()).toMatchSnapshot();
  });

  it("should render type=radio", function () {
    mount(
      <>
        <Input type="radio" name="gender" defaultValue="male" />,
        <Input type="radio" name="gender" defaultValue="female" />
      </>,
      { gender: "male" }
    );
    // male selected, female unselected
    expect(form.toJSON()).toMatchSnapshot(
      "radio: male selected, female unselected"
    );

    // trigger change in input2
    const input2 = form.root.findAll((el) => el.type == "input")[1];
    input2.props.onChange({
      target: { value: "female", checked: true },
    });
    expect(form.toJSON()).toMatchSnapshot(
      "radio: female selected, male unselected"
    );
  });

  it("should not propagate specific properties, like converter, to the HTML5 element", () => {
    mount(
      <Input
        type="text"
        className="foo"
        name="name"
        converter={Converters.text}
      />,
      {}
    );
    // state attribute should not be propagated to nested <input>
    expect(form.toJSON()).toMatchSnapshot();
  });

  it("should render a validation error", async function () {
    mount(<Input type="text" required name="name" />, {});
    await triggerSubmit({ name: "Please fill out this field" });
    // error message was rendered
    // error message is accessible: role=alert, aria-invalid, aria-describedby
    expect(form.toJSON()).toMatchSnapshot();
  });

  it("should add validation error to preexisting aria-describedby attribute", async function () {
    mount(
      <Input type="text" required name="name" aria-describedby="foo" />,
      {}
    );
    await triggerSubmit({ name: "Please fill out this field" });
    // error message was rendered
    // error message is accessible: role=alert, aria-invalid, aria-describedby
    expect(form.toJSON()).toMatchSnapshot();
  });

  it("should update number (also: onChange listener)", async () => {
    const values = { age: 20, color: "red" };
    const callback = jest.fn();
    mount(
      <Input type="number" name="age" step="1" min="1" onChange={callback} />,
      values
    );
    triggerChange({ value: "32.2" });
    await triggerSubmit();
    expect(onSubmit).toHaveBeenCalledWith({
      age: 32,
      color: "red",
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should work when controlled", () => {
    const values = { age: 20 };
    const callback = jest.fn();
    mount(
      <Input type="number" name="age" value={30} setValue={callback} />,
      values
    );
    expect(form.toJSON()).toMatchSnapshot();
    triggerChange({ value: "32" });
    expect(callback).toHaveBeenCalledWith(32);
    expect(form.toJSON()).toMatchSnapshot();
  });

  it("should update nested properties", async () => {
    const values: {
      // empty initially
      from?: { address: string };

      // not empty initially
      to?: { address: string };
    } = { to: { address: "barbaz" } };
    mount(
      <>
        <Input type="text" name="from.address" required />,
        <Input type="text" name="to.address" />,
      </>,
      values
    );
    triggerChange({ value: "foobar" });
    await triggerSubmit();
    expect(onSubmit).toHaveBeenCalledWith({
      from: { address: "foobar" },
      to: { address: "barbaz" },
    });
    expect(form.toJSON()).toMatchSnapshot();
  });

  it("required and optional checkboxes (also: set id attribute)", async function () {
    mount(
      <Input
        type="checkbox"
        name="subscribed"
        id="foobarbaz"
        required={false}
      />,
      {
        subscribed: false,
      }
    );
    await triggerSubmit();

    mount(
      <Input
        type="checkbox"
        name="subscribed"
        id="foobarbaz"
        required={true}
      />,
      {
        subscribed: false,
      }
    );
    await triggerSubmit({ subscribed: "Please fill out this field" });
    expect(form.toJSON()).toMatchSnapshot();
  });

  function validate(value: string): Promise<ValidationResult> {
    return Promise.resolve(value === "abc" ? undefined : "pattern");
  }

  it("custom async validation fails (also: onSubmit not called)", async function () {
    mount(<Input type="text" name="foo" validate={validate} />, { foo: "xyz" });
    await triggerSubmit({ foo: "Please match the requested format" });
    expect(form.toJSON()).toMatchSnapshot();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("custom async validation passes (also: onSubmit called)", async function () {
    mount(<Input type="text" name="foo" validate={validate} />, { foo: "abc" });
    await triggerSubmit();
    expect(form.toJSON()).toMatchSnapshot();
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("has access to formContext from onChange", async function () {
    mount(
      <Input
        type="checkbox"
        name="foo"
        onChange={(e, formContext) => {
          const value = e.target.checked;
          expect(value).toBe(formContext.getValue("foo"));
        }}
      />,
      { foo: true }
    );
    triggerChange({ value: "xxx", checked: true });
  });
});
