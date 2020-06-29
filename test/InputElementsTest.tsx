import React, {
  ReactElement,
  ChangeEvent,
  HTMLAttributes,
  InputHTMLAttributes,
} from "react";
import renderer, {
  ReactTestRenderer,
  act,
  ReactTestInstance,
} from "react-test-renderer";
import { Input } from "../src/components/InputElements";
import { Form, ValidationErrors } from "../src/components/Form";
import { Converters } from "../src/core/Converters";

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
  /*
  function waitForElement(props: any): Promise<ReactTestInstance[]> {
    return new Promise<ReactTestInstance[]>((resolve, reject) => {
      let tries = 0;
      function check() {
        const elements = form.root.findAll((el) =>
          Object.entries(props).every(
            ([propertyName, value]) => el[propertyName] == value
          )
        );
        if (elements.length) {
          resolve(elements);
        }
        if (tries++ < 5) {
          setTimeout(check, 10);
        } else {
          reject(
            new Error(
              `Timeout waiting for element with props: ${JSON.stringify(
                props
              )}.\nCurrent tree: ${JSON.stringify(form.toJSON(), null, "  ")}`
            )
          );
        }
      }
      setTimeout(check, 10);
    });
  }
*/
  async function triggerChange({
    value,
    checked,
  }: {
    value: string;
    checked?: boolean;
  }) {
    return act(() => {
      const inputElement = form.root.find((el) => el.type == "input");
      expect(inputElement.type).toBe("input");
      inputElement.props.onChange({
        target: {
          value,
          checked,
        },
      });
    });
  }

  async function triggerSubmit(expectErrors?: ValidationErrors) {
    return act(async () => {
      const formElement = form.root.find((el) => el.type == "form");
      try {
        await formElement.props.onSubmit({ preventDefault() {} });
        expect(expectErrors).toBeUndefined();
      } catch (errors) {
        expect(errors).toMatchObject(expectErrors);
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

  it("should update number (also: onChange listener)", async () => {
    const values = { age: 20, color: "red" };
    const callback = jest.fn();
    mount(
      <Input type="number" name="age" step="1" onChange={callback} />,
      values
    );
    await triggerChange({ value: "32.2" });
    expect(values).toMatchObject({
      age: 32,
      color: "red",
    });
    expect(callback).toHaveBeenCalledTimes(1);
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

  /*
  function initAsyncValidator(state) {
    const validator = (value) =>
      new Promise((resolve) => {
        resolve(value === "abc" ? undefined : "Validation failed");
      });
    mount(
      <Input type="text" name="foo" validator={validator} />,
      state
    );
    return form.getInstance();
  }

  it("custom validator with Promise expected to fail", function () {
    const state = { foo: "xyz" };
    initAsyncValidator(state);
    return form.validate().then((result) => {
      expect(result).toBe(false);
    });
  });

  it("custom validator with Promise expected to pass", function () {
    const state = { foo: "abc" };
    initAsyncValidator(state);
    return form.validate().then((result) => {
      expect(result).toBe(true);
    });
  });

  */
});
