import React from "react";
import { Input } from "../src/components/InputElements";
import { Form } from "../src/components/Form";
import { Button } from "../src/components/Button";
import { act } from "react-test-renderer";

describe("Form", function () {
  let submitCallback;

  function renderForm(initialValues: any, error?: Error) {
    submitCallback = jest.fn(async function () {
      if (!error) {
        return "all good";
      }
      throw error;
    });
    render(
      <Form onSubmit={submitCallback} initialValues={initialValues} role="form">
        <Input type="text" required name="name" />
        <Button>Save</Button>
      </Form>
    );
  }

  it("should not call onSubmit if validation does not pass", function () {
    renderForm({});
    act(() => fireEvent.submit(screen.getByRole("form")));
    expect(submitCallback).toHaveBeenCalledTimes(0);
  });

  it("should call onSubmit if validation passes", function () {
    renderForm({
      name: "foo",
    });
    act(() => fireEvent.submit(screen.getByRole("form")));
    expect(submitCallback).toHaveBeenCalledTimes(1);
  });

  /* TODO: promises and submitting
  it("should call onSubmit if validation passes", function () {
    renderForm({
      name: "foo",
    });
    act(() => fireEvent.submit(screen.getByRole("form")));
    expect(submitCallback).toHaveBeenCalledTimes(1);
  });


  */
});
