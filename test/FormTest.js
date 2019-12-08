import React from "react";
import { Form, Input } from "../src/react-data-input";
import renderer from "react-test-renderer";

function noop() {}
describe("Form", function() {
  function submit({ callback, state }) {
    const form = renderer.create(
      <Form onSubmit={callback}>
        <Input type="text" required state={state} name="name" />
      </Form>,
      {
        createNodeMock() {
          return {
            querySelector: noop
          };
        }
      }
    );
    return form.getInstance().onSubmit({ preventDefault: noop });
  }

  it("should call onSubmit only if validation passes", function() {
    const state = {};
    const callback = jest.fn(noop);
    return submit({ callback, state }).then(() => {
      // Invoked onSubmit() when validation was not passing
      expect(callback).toHaveBeenCalledTimes(0);
    });
  });

  it("should call onSubmit if validation passes", function() {
    const state = { name: "foo" };
    const callback = jest.fn(noop);
    return submit({ callback, state }).then(() => {
      // Not invoked onSubmit() when validation was passing
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });
});
