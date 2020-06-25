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
import { Input } from "../src/components/Elements";
import { Form } from "../src/components/Form";
import { Converters } from "../src/core/Converters";

describe("Input", function () {
  let onSubmit: () => Promise<string>;

  let form: ReactTestRenderer;

  function mount(input: ReactElement, initialValues: any) {
    onSubmit = jest.fn(async () => "foo");
    form = renderer.create(
      <Form onSubmit={onSubmit} initialValues={initialValues}>
        {input}
      </Form>
    );
  }

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

  async function triggerChange(event: ChangeEvent) {
    return act(() => {
      const inputElement = form.root.find((el) => el.type == "input");
      expect(inputElement.type).toBe("input");
      inputElement.props.onChange(event);
    });
  }

  async function triggerSubmit(waitForProps: any) {
    return act(async () => {
      const formElement = form.root.find((el) => el.type == "form");
      expect(formElement.type).toBe("form");
      formElement.props.onSubmit({ preventDefault() {} });
      await waitForElement(waitForProps);
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
        <Input type="radio" name="abtesting" value="a" />
        <Input type="radio" name="abtesting" value="b" />
      </>,
      { abtesting: "a" }
    );
    // input[checked] is set
    // different id calculated for each input
    expect(form.toJSON()).toMatchSnapshot();
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
    await triggerSubmit({ role: "alert" });
    // error message was rendered
    // error message is accessible: role=alert, aria-invalid, aria-describedby
    expect(form.toJSON()).toMatchSnapshot();
  });

  /*
  it("should update int on change", function () {
    const state = { age: 20, color: "red" };
    const callback = jest.fn(noop);
    mount(
      <Input
        type="number"
        name="age"
        state={state}
        step="1"
        onChange={callback}
      />,
      state
    );
    const input = findInputElement(form);
    input.props.onChange({
      target: { value: "32.2" },
    });

    expect(state).toMatchObject({
      age: 32,
      color: "red",
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should update float on change", function () {
    const state = { age: 20 };
    mount(<Input type="number" name="age" step="0.01" />, state);
    const input = findInputElement(form);
    input.props.onChange({
      target: { value: "32.2" },
    });
    expect(state.age).toBe(32.2);
  });

  it("should not throw required error with not required, unchecked checkboxes", function () {
    const state = { subscribed: false };
    mount(
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

  it("should throw required error with required, unchecked checkboxes", function () {
    const state = { subscribed: false };
    mount(
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

  it("should render type=radio", function () {
    const state = { gender: "male" };
    mount(
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
    const input2 = form.root.findAll((el) => el.type == "input")[1];
    input2.props.onChange({
      target: { value: "female", checked: true },
    });
    expect(form.toJSON()).toMatchSnapshot(
      "radio: female selected, male unselected"
    );
  });

  it("should not throw required error with empty, optional emails", function () {
    mount(<Input type="email" name="email" />, {
      email: "",
    });
    return form
      .getInstance()
      .validationComponents[0].validate()
      .then(() => {
        // no input error
        expect(form.toJSON()).toMatchSnapshot();
      });
  });

  it("should throw required error with required emails", function () {
    mount(<Input type="email" name="email" required />, {
      email: "",
    });
    return form
      .getInstance()
      .validationComponents[0].validate()
      .then(() => {
        // should show input error
        expect(form.toJSON()).toMatchSnapshot();
      });
  });

  it("should add aria-describedby if there are validation errors", function () {
    mount(
      <Input type="text" name="name" required aria-describedby="foobar" />,
      {
        name: "",
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

  it("should render validation errors when the form value is not an e-mail", function () {
    mount(<Input type="email" name="email" />, {
      email: "foo",
    });
    return form
      .getInstance()
      .validationComponents[0].validate()
      .then(() => {
        // should show input error
        expect(form.toJSON()).toMatchSnapshot();
      });
  });
  */
});
